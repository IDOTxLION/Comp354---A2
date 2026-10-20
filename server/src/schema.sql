-- Prices are in cents (1150 = $11.50) to avoid rounding errors.

CREATE TABLE IF NOT EXISTS restaurants (
  id        INTEGER PRIMARY KEY,
  name      TEXT NOT NULL,
  cuisine   TEXT NOT NULL,
  opens_at  TEXT NOT NULL,  -- 'HH:MM'
  closes_at TEXT NOT NULL   -- 'HH:MM'
);

CREATE TABLE IF NOT EXISTS menu_items (
  id            INTEGER PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
  name          TEXT    NOT NULL,
  description   TEXT    NOT NULL DEFAULT '',
  category      TEXT    NOT NULL,
  price_cents   INTEGER NOT NULL,
  available     INTEGER NOT NULL DEFAULT 1
);
