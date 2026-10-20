import express from 'express';
import { orderRoutes } from './routes/orders.js';

// Builds the API around a database, so tests can pass an in-memory one.
export function createApp(db) {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    const { n } = db.prepare('SELECT COUNT(*) AS n FROM restaurants').get();
    res.json({ status: 'ok', restaurants: n });
  });

  app.use('/api', orderRoutes(db));

  return app;
}
