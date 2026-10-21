import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../src/db.js';
import { seed } from '../src/seed.js';
import { createApp } from '../src/app.js';

function setup(t) {
  const db = openDb(':memory:');
  seed(db);

  const add = db.prepare(
    'INSERT INTO orders (restaurant_id, customer_name, pickup_time, status, total_cents) VALUES (1, ?, ?, ?, 2300)'
  );

  const first = Number(add.run('Sam', '12:30', 'Received').lastInsertRowid);
  const second = Number(add.run('Alex', '12:00', 'Preparing').lastInsertRowid);
  const completed = Number(add.run('Lee', '11:00', 'Completed').lastInsertRowid);

  db.prepare(
    'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price_cents) VALUES (?, 1, 2, 1150)'
  ).run(first);

  const server = createApp(db).listen(0);
  t.after(() => {
    server.close();
    db.close();
  });

  return {
    first,
    second,
    completed,
    url: `http://localhost:${server.address().port}`
  };
}

test('staff orders include items and sort active orders by pickup time', async (t) => {
  const { first, second, completed, url } = setup(t);

  const res = await fetch(`${url}/api/restaurants/1/orders`);
  assert.equal(res.status, 200);

  const orders = await res.json();
  assert.deepEqual(orders.map((order) => order.id), [second, first]);
  assert.equal(orders[1].customer_name, 'Sam');
  assert.equal(orders[1].items[0].quantity, 2);
  assert.ok(!orders.some((order) => order.id === completed));
});

test('status moves forward one step and completed orders leave the list', async (t) => {
  const { first, url } = setup(t);

  for (const status of ['Preparing', 'Ready for Pickup', 'Completed']) {
    const res = await fetch(`${url}/api/orders/${first}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    assert.equal(res.status, 200);
    assert.equal((await res.json()).status, status);
  }

  const orders = await (await fetch(`${url}/api/restaurants/1/orders`)).json();
  assert.ok(!orders.some((order) => order.id === first));
});

test('invalid status changes do not modify the order', async (t) => {
  const { first, url } = setup(t);

  for (const status of ['Completed', 'Received', 'Unknown', 'Cancelled']) {
    const res = await fetch(`${url}/api/orders/${first}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    assert.equal(res.status, 400);
  }

  const order = await (await fetch(`${url}/api/orders/${first}`)).json();
  assert.equal(order.status, 'Received');
});

test('unknown orders return 404', async (t) => {
  const { url } = setup(t);

  assert.equal((await fetch(`${url}/api/orders/999`)).status, 404);

  const res = await fetch(`${url}/api/orders/999/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Preparing' })
  });

  assert.equal(res.status, 404);
});

test('completed orders cannot advance', async (t) => {
  const { completed, url } = setup(t);

  const res = await fetch(`${url}/api/orders/${completed}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Received' })
  });

  assert.equal(res.status, 400);
});
