import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../src/db.js';
import { seed } from '../src/seed.js';
import { createApp } from '../src/app.js';

test('GET /api/health reports the number of restaurants', async (t) => {
  const db = openDb(':memory:');
  seed(db);
  // Port 0 lets the OS pick a free port.
  const server = createApp(db).listen(0);
  t.after(() => server.close());
  const url = `http://localhost:${server.address().port}`;

  const res = await fetch(`${url}/api/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok', restaurants: 3 });
});
