import { useEffect, useState } from 'react';

const nextStatus = {
  Received: 'Preparing',
  Preparing: 'Ready for Pickup',
  'Ready for Pickup': 'Completed'
};

export default function StaffPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState('');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetch('/api/restaurants')
      .then((res) => {
        if (!res.ok) throw new Error('Could not load restaurants');
        return res.json();
      })
      .then((data) => {
        setRestaurants(data);
        if (data.length) setRestaurantId(String(data[0].id));
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!restaurantId) return;

    let cancelled = false;
    setLoading(true);
    setError('');

    fetch(`/api/restaurants/${restaurantId}/orders`)
      .then((res) => {
        if (!res.ok) throw new Error('Could not load orders');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [restaurantId]);

  async function advance(order) {
    setUpdating(order.id);
    setError('');

    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus[order.status] })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Could not update order');
      }

      const list = await fetch(`/api/restaurants/${restaurantId}/orders`);
      if (!list.ok) throw new Error('Could not refresh orders');
      setOrders(await list.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <section>
      <h1>Staff Orders</h1>

      <label htmlFor="staff-restaurant">Restaurant: </label>
      <select
        id="staff-restaurant"
        value={restaurantId}
        onChange={(e) => setRestaurantId(e.target.value)}
      >
        {restaurants.map((restaurant) => (
          <option key={restaurant.id} value={restaurant.id}>
            {restaurant.name}
          </option>
        ))}
      </select>

      {error && <p role="alert">{error}</p>}
      {loading && <p>Loading orders...</p>}

      {!loading && restaurantId && orders.length === 0 && (
        <p>No active orders.</p>
      )}

      {!loading && orders.map((order) => (
        <article key={order.id} style={{ border: '1px solid #ccc', padding: 16, marginTop: 16 }}>
          <h2>Order #{order.id}</h2>
          <p>Customer: {order.customer_name}</p>
          <p>Pickup time: {order.pickup_time}</p>
          <p>Status: {order.status}</p>
          <ul>
            {order.items.map((item) => (
              <li key={item.menu_item_id}>
                {item.quantity} x {item.name}
              </li>
            ))}
          </ul>
          {nextStatus[order.status] && (
            <button
              type="button"
              disabled={updating !== null}
              onClick={() => advance(order)}
            >
              {updating === order.id ? 'Updating...' : `Mark ${nextStatus[order.status]}`}
            </button>
          )}
        </article>
      ))}
    </section>
  );
}
