import { Router } from 'express';

export function restaurantRoutes(db) {
  const router = Router();

  router.get('/restaurants', (req, res) => {
    const restaurants = db
      .prepare('SELECT id, name, cuisine, opens_at, closes_at FROM restaurants ORDER BY name')
      .all();
    res.json(restaurants);
  });

  return router;
}
