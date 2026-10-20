import { Router } from 'express';

export function restaurantRoutes(db) {
  const router = Router();

  router.get('/restaurants', (req, res) => {
    const restaurants = db
      .prepare('SELECT id, name, cuisine, opens_at, closes_at FROM restaurants ORDER BY name')
      .all();
    res.json(restaurants);
  });

  router.get('/restaurants/:id', (req, res) => {
    const restaurant = db
      .prepare('SELECT id, name, cuisine, opens_at, closes_at FROM restaurants WHERE id = ?')
      .get(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    const menu = db
      .prepare(
        'SELECT id, name, description, category, price_cents FROM menu_items WHERE restaurant_id = ? AND available = 1 ORDER BY id'
      )
      .all(restaurant.id);
    res.json({ ...restaurant, menu });
  });

  return router;
}
