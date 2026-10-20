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

See [docs/definition-of-done.md](docs/definition-of-done.md) and [docs/daily-scrum/](docs/daily-scrum/).
