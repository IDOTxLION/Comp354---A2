import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../OrderContext.jsx';
import { formatPrice } from '../format.js';

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function toTime(minutes) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  return `${hours}:${String(minutes % 60).padStart(2, '0')}`;
}

function pickupTimes(restaurant) {
  const now = new Date();
  const earliest = now.getHours() * 60 + now.getMinutes() + 15;
  const times = [];
  for (let m = toMinutes(restaurant.opens_at); m <= toMinutes(restaurant.closes_at); m += 15) {
    if (m >= earliest) times.push(toTime(m));
  }
  return times;
}

export default function CheckoutPage() {
  const { order, clear } = useOrder();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [name, setName] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!order.restaurant_id) return;
    fetch(`/api/restaurants/${order.restaurant_id}`)
      .then((res) => res.json())
      .then((data) => {
        setRestaurant(data);
        setPickupTime(pickupTimes(data)[0] ?? '');
      });
  }, [order.restaurant_id]);

  if (order.items.length === 0) {
    return (
      <>
        <h1>Checkout</h1>
        <p>Your order is empty.</p>
        <Link to="/">Back to restaurants</Link>
      </>
    );
  }

  if (!restaurant) return <p>Loading...</p>;

  const times = pickupTimes(restaurant);
  const total = order.items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);

  async function placeOrder(event) {
    event.preventDefault();
    setError('');
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant_id: order.restaurant_id,
        customer_name: name,
        pickup_time: pickupTime,
        items: order.items.map((i) => ({ menu_item_id: i.menu_item_id, quantity: i.quantity })),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    clear();
    navigate(`/orders/${data.id}`);
  }

  return (
    <>
      <h1>Checkout</h1>
      <p>{restaurant.name}</p>
      <ul>
        {order.items.map((i) => (
          <li key={i.menu_item_id}>
            {i.quantity} x {i.name}: {formatPrice(i.price_cents * i.quantity)}
          </li>
        ))}
      </ul>
      <p>Total: {formatPrice(total)}</p>
      <form onSubmit={placeOrder}>
        <p>
          <label>
            Name <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        </p>
        <p>
          <label>
            Pickup time{' '}
            <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}>
              {times.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
        </p>
        {times.length === 0 && <p>No pickup times left today.</p>}
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={times.length === 0}>Place order</button>
      </form>
      <Link to={`/restaurants/${order.restaurant_id}`}>Back to menu</Link>
    </>
  );
}
