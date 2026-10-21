-- Prices are in cents (1150 = $11.50) to avoid rounding errors.

CREATE TABLE IF NOT EXISTS restaurants (
  id        INTEGER PRIMARY KEY,
  name      TEXT NOT NULL,
  cuisine   TEXT NOT NULL,
  opens_at  TEXT NOT NULL,  -- 'HH:MM'
  closes_at TEXT NOT NULL,  -- 'HH:MM'
  prep_minutes INTEGER NOT NULL DEFAULT 15
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

CREATE TABLE IF NOT EXISTS orders (
  id            INTEGER PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
  customer_name TEXT    NOT NULL,
  pickup_time   TEXT    NOT NULL,
  status        TEXT    NOT NULL DEFAULT 'Received'
                CHECK (status IN ('Received', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled')),
  total_cents   INTEGER NOT NULL,
  created_at    TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id               INTEGER PRIMARY KEY,
  order_id         INTEGER NOT NULL REFERENCES orders(id),
  menu_item_id     INTEGER NOT NULL REFERENCES menu_items(id),
  quantity         INTEGER NOT NULL,
  unit_price_cents INTEGER NOT NULL
);
