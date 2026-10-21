import { Router } from 'express';

const statuses = ['Received', 'Preparing', 'Ready for Pickup', 'Completed'];

export function orderStatusRoutes(db) {
  const router = Router();

  function getOrder(id) {
    const order = db.prepare(`
      SELECT o.*, r.name AS restaurant_name
      FROM orders o
      JOIN restaurants r ON r.id = o.restaurant_id
      WHERE o.id = ?
    `).get(id);

    if (!order) return null;

    const items = db.prepare(`
      SELECT oi.menu_item_id, m.name, oi.quantity, oi.unit_price_cents
      FROM order_items oi
      JOIN menu_items m ON m.id = oi.menu_item_id
      WHERE oi.order_id = ?
      ORDER BY oi.id
    `).all(id);

    return { ...order, items };
  }

  router.get('/orders/:id', (req, res) => {
    const order = getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  });

  router.get('/restaurants/:id/orders', (req, res) => {
    const ids = db.prepare(`
      SELECT id FROM orders
      WHERE restaurant_id = ? AND status NOT IN ('Completed', 'Cancelled')
      ORDER BY pickup_time, id
    `).all(req.params.id);
    res.json(ids.map(({ id }) => getOrder(id)));
  });

  router.patch('/orders/:id/status', (req, res) => {
    const order = getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const nextStatus = statuses[statuses.indexOf(order.status) + 1];
    if (!nextStatus || req.body?.status !== nextStatus) {
      return res.status(400).json({ error: 'Invalid status change' });
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(nextStatus, order.id);
    res.json(getOrder(order.id));
  });

  return router;
}
