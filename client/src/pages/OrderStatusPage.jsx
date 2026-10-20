import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatPrice } from '../format.js';

export default function OrderStatusPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError('');
    setOrder(null);

    fetch(`/api/orders/${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not load order');
        return data;
      })
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading order...</p>;

  if (error) {
    return (
      <>
        <h1>{error}</h1>
        <Link to="/">Back to restaurants</Link>
      </>
    );
  }

  return (
    <>
      <h1>Order #{order.id}</h1>
      <p>Restaurant: {order.restaurant_name}</p>
      <p>Status: {order.status}</p>
      <p>Pickup time: {order.pickup_time}</p>

      <h2>Items</h2>
      <ul>
        {order.items.map((item) => (
          <li key={item.menu_item_id}>
            {item.quantity} x {item.name}: {formatPrice(item.unit_price_cents * item.quantity)}
          </li>
        ))}
      </ul>

      <p>Total: {formatPrice(order.total_cents)}</p>
      <p>Refresh this page to see the latest status.</p>
      <Link to="/">Back to restaurants</Link>
    </>
  );
}
