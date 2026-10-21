import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { openDb } from '../src/db.js';
import { seed } from '../src/seed.js';
import { orderRoutes, pickupTimeError } from '../src/routes/orders.js';

const noon = new Date(2026, 9, 21, 12, 0);
const casseCroute = { opens_at: '11:00', closes_at: '22:00', prep_minutes: 20 };
const greenBowl = { opens_at: '07:30', closes_at: '15:00', prep_minutes: 10 };

function startServer(t, now = noon) {
  const db = openDb(':memory:');
  seed(db);
  const app = express();
  app.use(express.json());
  app.use('/api', orderRoutes(db, () => now));
  const server = app.listen(0);
  t.after(() => server.close());
  const placeOrder = (body) =>
    fetch(`http://localhost:${server.address().port}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  const orderCount = () => db.prepare('SELECT COUNT(*) AS n FROM orders').get().n;
  return { db, placeOrder, orderCount };
}

const validOrder = {
  restaurant_id: 1,
  customer_name: 'Sam',
  pickup_time: '12:30',
  items: [{ menu_item_id: 1, quantity: 2 }, { menu_item_id: 2, quantity: 1 }],
};

test('pickup time at least the preparation time away and within opening hours is valid', () => {
  assert.equal(pickupTimeError('12:20', casseCroute, noon), null);
  assert.equal(pickupTimeError('22:00', casseCroute, noon), null);
  assert.equal(pickupTimeError('11:00', casseCroute, new Date(2026, 9, 21, 10, 0)), null);
});

test('pickup time in the past or sooner than the preparation time is rejected', () => {
  assert.match(pickupTimeError('11:30', casseCroute, noon), /20 minutes/);
  assert.match(pickupTimeError('12:19', casseCroute, noon), /20 minutes/);
});

test('each restaurant uses its own preparation time', () => {
  assert.equal(pickupTimeError('12:10', greenBowl, noon), null);
  assert.match(pickupTimeError('12:09', greenBowl, noon), /10 minutes/);
  assert.match(pickupTimeError('12:10', casseCroute, noon), /20 minutes/);
});

test('pickup time outside opening hours is rejected', () => {
  assert.match(pickupTimeError('22:15', casseCroute, noon), /between 11:00 and 22:00/);
  assert.match(pickupTimeError('10:45', casseCroute, new Date(2026, 9, 21, 8, 0)), /between/);
});

test('invalid pickup time format is rejected', () => {
  assert.ok(pickupTimeError('12:5', casseCroute, noon));
  assert.ok(pickupTimeError(undefined, casseCroute, noon));
});

test('POST /api/orders creates a Received order with the total from the database', async (t) => {
  const { db, placeOrder } = startServer(t);
  const res = await placeOrder(validOrder);
  assert.equal(res.status, 201);
  const { id } = await res.json();

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  assert.equal(order.status, 'Received');
  assert.equal(order.customer_name, 'Sam');
  assert.equal(order.pickup_time, '12:30');
  assert.equal(order.total_cents, 1150 * 2 + 1475);

  const items = db.prepare('SELECT menu_item_id, quantity, unit_price_cents FROM order_items WHERE order_id = ? ORDER BY menu_item_id').all(id);
  assert.deepEqual(items.map((i) => ({ ...i })), [
    { menu_item_id: 1, quantity: 2, unit_price_cents: 1150 },
    { menu_item_id: 2, quantity: 1, unit_price_cents: 1475 },
  ]);
});

test('POST /api/orders ignores a total sent by the client', async (t) => {
  const { db, placeOrder } = startServer(t);
  const res = await placeOrder({ ...validOrder, total_cents: 1 });
  const { id } = await res.json();
  assert.equal(db.prepare('SELECT total_cents FROM orders WHERE id = ?').get(id).total_cents, 3775);
});

test('POST /api/orders rejects a pickup time sooner than the restaurant preparation time', async (t) => {
  const { placeOrder, orderCount } = startServer(t);
  const res = await placeOrder({ ...validOrder, pickup_time: '12:15' });
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /20 minutes/);
  assert.equal(orderCount(), 0);
});

test('POST /api/orders uses the preparation time of the chosen restaurant', async (t) => {
  const { placeOrder } = startServer(t);
  const res = await placeOrder({
    restaurant_id: 3, customer_name: 'Sam', pickup_time: '12:10',
    items: [{ menu_item_id: 9, quantity: 1 }],
  });
  assert.equal(res.status, 201);
});

test('POST /api/orders rejects a pickup time outside opening hours', async (t) => {
  const { placeOrder, orderCount } = startServer(t);
  const res = await placeOrder({ ...validOrder, pickup_time: '22:30' });
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /between/);
  assert.equal(orderCount(), 0);
});

test('POST /api/orders rejects an empty name, empty items and bad quantities', async (t) => {
  const { placeOrder, orderCount } = startServer(t);
  const bodies = [
    { ...validOrder, customer_name: '  ' },
    { ...validOrder, items: [] },
    { ...validOrder, items: [{ menu_item_id: 1, quantity: 0 }] },
    { ...validOrder, items: [{ menu_item_id: 1, quantity: 1.5 }] },
  ];
  for (const body of bodies) {
    const res = await placeOrder(body);
    assert.equal(res.status, 400);
    assert.ok((await res.json()).error);
  }
  assert.equal(orderCount(), 0);
});

test('POST /api/orders rejects items from another restaurant or not available', async (t) => {
  const { db, placeOrder, orderCount } = startServer(t);
  let res = await placeOrder({ ...validOrder, items: [{ menu_item_id: 5, quantity: 1 }] });
  assert.equal(res.status, 400);

  db.prepare('UPDATE menu_items SET available = 0 WHERE id = 1').run();
  res = await placeOrder({ ...validOrder, items: [{ menu_item_id: 1, quantity: 1 }] });
  assert.equal(res.status, 400);
  assert.equal(orderCount(), 0);
});

test('POST /api/orders returns 404 for an unknown restaurant', async (t) => {
  const { placeOrder } = startServer(t);
  const res = await placeOrder({ ...validOrder, restaurant_id: 99 });
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { error: 'Restaurant not found' });
});
