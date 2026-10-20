import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../src/db.js';
import { seed } from '../src/seed.js';
import { createApp } from '../src/app.js';

function startServer(t, db) {
  const server = createApp(db).listen(0);
  t.after(() => server.close());
  return `http://localhost:${server.address().port}`;
}

test('GET /api/restaurants lists every restaurant sorted by name', async (t) => {
  const db = openDb(':memory:');
  seed(db);
  const url = startServer(t, db);

  const res = await fetch(`${url}/api/restaurants`);
  assert.equal(res.status, 200);
  const restaurants = await res.json();
  assert.deepEqual(
    restaurants.map((r) => r.name),
    ['Casse-Croûte Saint-Denis', 'Green Bowl', 'Little Saigon Kitchen']
  );
  assert.deepEqual(restaurants[1], {
    id: 3, name: 'Green Bowl', cuisine: 'Vegetarian', opens_at: '07:30', closes_at: '15:00',
  });
});

test('GET /api/restaurants returns an empty list when there are no restaurants', async (t) => {
  const url = startServer(t, openDb(':memory:'));

  const res = await fetch(`${url}/api/restaurants`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), []);
});

test('GET /api/restaurants/:id returns the restaurant with its menu', async (t) => {
  const db = openDb(':memory:');
  seed(db);
  const url = startServer(t, db);

  const res = await fetch(`${url}/api/restaurants/1`);
  assert.equal(res.status, 200);
  const restaurant = await res.json();
  assert.equal(restaurant.name, 'Casse-Croûte Saint-Denis');
  assert.equal(restaurant.opens_at, '11:00');
  assert.equal(restaurant.prep_minutes, 20);
  assert.equal(restaurant.menu.length, 4);
  assert.deepEqual(restaurant.menu[0], {
    id: 1, name: 'Classic Poutine', description: 'Fries, cheese curds, brown gravy', category: 'Mains', price_cents: 1150,
  });
});

test('GET /api/restaurants/:id leaves out unavailable items', async (t) => {
  const db = openDb(':memory:');
  seed(db);
  db.prepare('UPDATE menu_items SET available = 0 WHERE id = 1').run();
  const url = startServer(t, db);

  const restaurant = await (await fetch(`${url}/api/restaurants/1`)).json();
  assert.equal(restaurant.menu.length, 3);
  assert.ok(restaurant.menu.every((item) => item.id !== 1));
});

test('GET /api/restaurants/:id returns 404 for an unknown restaurant', async (t) => {
  const db = openDb(':memory:');
  seed(db);
  const url = startServer(t, db);

  const res = await fetch(`${url}/api/restaurants/99`);
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { error: 'Restaurant not found' });
});
