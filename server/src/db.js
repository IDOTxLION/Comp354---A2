import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const DB_PATH = join(import.meta.dirname, '..', 'data', 'quickbite.db');

// Opens the database (':memory:' for tests) and creates the tables if needed.
export function openDb(path = DB_PATH) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(readFileSync(join(import.meta.dirname, 'schema.sql'), 'utf8'));
  return db;
}
