import { createApp } from './app.js';
import { openDb } from './db.js';
import { seed } from './seed.js';

const db = openDb();

// On a fresh clone the database is empty: load the sample restaurants.
if (db.prepare('SELECT COUNT(*) AS n FROM restaurants').get().n === 0) seed(db);

createApp(db).listen(3001, () => console.log('API running on http://localhost:3001'));
