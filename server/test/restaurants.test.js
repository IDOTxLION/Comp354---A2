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
