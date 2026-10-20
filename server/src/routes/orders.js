import { Router } from 'express';

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function pickupTimeError(pickupTime, restaurant, now) {
  if (typeof pickupTime !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(pickupTime)) {
    return 'Please choose a pickup time';
  }
  const pickup = toMinutes(pickupTime);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  if (pickup < nowMinutes + 15) {
    return 'Pickup time must be at least 15 minutes from now';
  }
  if (pickup < toMinutes(restaurant.opens_at) || pickup > toMinutes(restaurant.closes_at)) {
    return `Pickup time must be between ${restaurant.opens_at} and ${restaurant.closes_at}`;
  }
  return null;
}

export function orderRoutes(db, getNow = () => new Date()) {
  const router = Router();

  router.post('/orders', (req, res) => {
    const { restaurant_id, customer_name, pickup_time, items } = req.body ?? {};

    if (typeof customer_name !== 'string' || customer_name.trim() === '') {
      return res.status(400).json({ error: 'Please enter your name' });
    }

    const restaurant = db.prepare('SELECT * FROM restaurants WHERE id = ?').get(restaurant_id ?? null);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Your order is empty' });
    }

    const findItem = db.prepare(
      'SELECT * FROM menu_items WHERE id = ? AND restaurant_id = ? AND available = 1'
    );
    const lines = [];
    for (const item of items) {
      if (!Number.isInteger(item?.quantity) || item.quantity < 1) {
        return res.status(400).json({ error: 'Each quantity must be at least 1' });
      }
      const menuItem = findItem.get(item.menu_item_id ?? null, restaurant.id);
      if (!menuItem) {
        return res.status(400).json({ error: 'An item in your order is not available' });
      }
      lines.push({ menuItem, quantity: item.quantity });
    }

    const timeError = pickupTimeError(pickup_time, restaurant, getNow());
    if (timeError) {
      return res.status(400).json({ error: timeError });
    }

    const total = lines.reduce((sum, line) => sum + line.menuItem.price_cents * line.quantity, 0);

    db.exec('BEGIN');
    const { lastInsertRowid } = db
      .prepare('INSERT INTO orders (restaurant_id, customer_name, pickup_time, total_cents) VALUES (?, ?, ?, ?)')
      .run(restaurant.id, customer_name.trim(), pickup_time, total);
    const addLine = db.prepare(
      'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price_cents) VALUES (?, ?, ?, ?)'
    );
    for (const line of lines) {
      addLine.run(lastInsertRowid, line.menuItem.id, line.quantity, line.menuItem.price_cents);
    }
    db.exec('COMMIT');

    res.status(201).json({ id: Number(lastInsertRowid) });
  });

  return router;
}
