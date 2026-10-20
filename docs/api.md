# API and shared conventions

The API contract so that everything is consistant with each other. If something needs to change, update this file in the same PR and tell the team.

## Conventions

- JSON keys use the database column names (`snake_case`), so rows can be returned as they are.
- Prices are integers in cents (`1150` is $11.50). The client formats them with `formatPrice` from `client/src/format.js`.
- Times are `"HH:MM"` strings (24-hour, zero-padded) in the server's local time, so they can be compared as strings. Orders are for today only.
- Errors return a status code and `{ "error": "message" }`. `400` for invalid input, `404` for something that does not exist.
- Order statuses, in order: `Received`, `Preparing`, `Ready for Pickup`, `Completed`. `Cancelled` exists in the schema for PBI-11 and is not used in Sprint 1.

## Database

`restaurants` has a `prep_minutes` column (PBI-13): the restaurant's minimum preparation time in minutes.

```sql
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
```

`unit_price_cents` keeps the price at the time of the order so later menu changes do not change old orders.

## Endpoints

### `GET /api/restaurants` (PBI-01)

`200`, sorted by name:

```json
[
  { "id": 1, "name": "Casse-Croûte Saint-Denis", "cuisine": "Québécois", "opens_at": "11:00", "closes_at": "22:00" }
]
```

### `GET /api/restaurants/:id` (PBI-02)

`200`, with only available menu items (`available = 1`). `prep_minutes` is how many minutes the restaurant needs to prepare an order (PBI-13):

```json
{
  "id": 1, "name": "Casse-Croûte Saint-Denis", "cuisine": "Québécois", "opens_at": "11:00", "closes_at": "22:00", "prep_minutes": 20,
  "menu": [
    { "id": 1, "name": "Classic Poutine", "description": "Fries, cheese curds, brown gravy", "category": "Mains", "price_cents": 1150 }
  ]
}
```

`404` `{ "error": "Restaurant not found" }`

### `POST /api/orders` (PBI-04)

Request:

```json
{
  "restaurant_id": 1,
  "customer_name": "Sam",
  "pickup_time": "12:30",
  "items": [ { "menu_item_id": 1, "quantity": 2 } ]
}
```

Rules, all checked on the server:
- `customer_name` is not empty.
- `items` is not empty, every quantity is a whole number of at least 1, and every item is available and belongs to `restaurant_id`.
- `pickup_time` is at least 15 minutes from now, and between the restaurant's `opens_at` and `closes_at` (both included).
- The total is calculated from the prices in the database. The client never sends a total.

`201` `{ "id": 7 }`. The checkout page then opens `/orders/7`.
`400` `{ "error": "..." }` with a message the checkout page can show as is. `404` if the restaurant does not exist.

### `GET /api/orders/:id` (PBI-05)

`200`:

```json
{
  "id": 7, "restaurant_id": 1, "restaurant_name": "Casse-Croûte Saint-Denis",
  "customer_name": "Sam", "pickup_time": "12:30", "status": "Received",
  "total_cents": 2300, "created_at": "2026-10-21 15:02:11",
  "items": [ { "menu_item_id": 1, "name": "Classic Poutine", "quantity": 2, "unit_price_cents": 1150 } ]
}
```

`404` `{ "error": "Order not found" }`

### `GET /api/restaurants/:id/orders` (PBI-06)

`200`, the restaurant's active orders (not `Completed` or `Cancelled`), soonest `pickup_time` first, each in the shape of `GET /api/orders/:id`.

### `PATCH /api/orders/:id/status` (PBI-06)

Request: `{ "status": "Preparing" }`

Only the next status is accepted: `Received` to `Preparing`, `Preparing` to `Ready for Pickup`, `Ready for Pickup` to `Completed`.
`200` with the updated order. `400` `{ "error": "..." }` for any other status, and the order is unchanged. `404` if the order does not exist.

## Server files

Each group of endpoints is an Express router in its own file, mounted in `server/src/app.js` with one line:

| File | Endpoints | PBI |
|---|---|---|
| `server/src/routes/restaurants.js` | `GET /api/restaurants`, `GET /api/restaurants/:id` | 01, 02 |
| `server/src/routes/orders.js` | `POST /api/orders` | 04 |
| `server/src/routes/order-status.js` | `GET /api/orders/:id`, `GET /api/restaurants/:id/orders`, `PATCH /api/orders/:id/status` | 05, 06 |

Each file exports a function that takes the database and returns a router, e.g. `export function restaurantRoutes(db)`, mounted with `app.use('/api', restaurantRoutes(db))`. Tests go in a matching file in `server/test/`.

## Client pages

| Route | Page | PBI |
|---|---|---|
| `/` | Restaurant list | 01 |
| `/restaurants/:id` | Menu, with the order summary | 02, 03 |
| `/checkout` | Name, pickup time, place order | 04 |
| `/orders/:id` | Order status | 05 |
| `/staff` | Staff orders | 06 |

## The order on the client (PBI-03)

The order in progress is kept in memory with React context, in `client/src/OrderContext.jsx` (it is lost on a page refresh, which is fine for now). `OrderProvider` wraps the app in `main.jsx`, and pages read it with `useOrder()`:

```js
const { order, addItem, removeItem, setQuantity, clear } = useOrder();
// order: { restaurant_id, items: [{ menu_item_id, name, price_cents, quantity }] }
// addItem(restaurant_id, menuItem): adding from another restaurant starts a new order
// total in cents: order.items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0)
```

The checkout page turns `order` into the `POST /api/orders` request, and calls `clear()` after the order is placed.
