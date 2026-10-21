# QuickBite

Online ordering and pickup for independent restaurants. COMP 354 (Fall 2026), Assignment 2.

Team: William Lamer (Product Owner), Aaleen Abbas Syed (Scrum Master), Marco Kwan, Rushan Kazim.

## Running locally

Needs Node.js 22.13 or newer. Run `npm install`, then in two terminals:

```bash
npm run server   # API on http://localhost:3001
npm run client   # app on http://localhost:5173
```

The database is created with sample restaurants on first start. `npm test` runs the API tests.

The API and the client pages are described in [docs/api.md](docs/api.md).

## Endpoints

- `GET /api/restaurants`: all restaurants with their cuisine and opening hours, sorted by name.
- `GET /api/restaurants/:id`: one restaurant with its available menu items. `404` if it does not exist.


### Order Endpoints

#### GET /api/orders/:id

Returns an order's details, including its restaurant, items, total, pickup time, and current status.

Example: `GET /api/orders/2`

- `200 OK`: Returns the order details.
- `404 Not Found`: Returns `{"error":"Order not found"}`.

#### GET /api/restaurants/:id/orders

Returns the active orders for a restaurant, sorted by pickup time and order ID.

Example: `GET /api/restaurants/1/orders`

- Excludes completed and cancelled orders.
- Returns an array containing each order's details.

#### PATCH /api/orders/:id/status

Updates an order to its next status.

Example: `PATCH /api/orders/2/status`

Request body:

```json
{
  "status": "Preparing"
}
```

Allowed status transitions:

1. `Received` to `Preparing`
2. `Preparing` to `Ready for Pickup`
3. `Ready for Pickup` to `Completed`

Responses:

- `200 OK`: Returns the updated order.
- `400 Bad Request`: Invalid status transition.
- `404 Not Found`: Order does not exist.

### Order Status Pages

- Customer order status: `/orders/:id`
- Staff order management: `/staff`

See [docs/definition-of-done.md](docs/definition-of-done.md) and [docs/daily-scrum/](docs/daily-scrum/).