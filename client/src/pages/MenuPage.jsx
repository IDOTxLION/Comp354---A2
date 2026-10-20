import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatPrice } from '../format.js';
import { useOrder } from '../OrderContext.jsx';
import OrderSummary from '../OrderSummary.jsx';

export default function MenuPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const { addItem } = useOrder();

  useEffect(() => {
    fetch(`/api/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => (data.error ? setError(data.error) : setRestaurant(data)))
      .catch(() => setError('Could not load the menu.'));
  }, [id]);

  if (error) {
    return (
      <>
        <p>{error}</p>
        <Link to="/">Back to restaurants</Link>
      </>
    );
  }
  if (!restaurant) return <p>Loading...</p>;

  return (
    <>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.cuisine}, {restaurant.opens_at} to {restaurant.closes_at}</p>
      {groupByCategory(restaurant.menu).map((group) => (
        <section key={group.category}>
          <h2>{group.category}</h2>
          <ul className="menu">
            {group.items.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong> {formatPrice(item.price_cents)}{' '}
                <button onClick={() => addItem(restaurant.id, item)}>Add</button>
                <div>{item.description}</div>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <OrderSummary />
    </>
  );
}

function groupByCategory(menu) {
  const groups = [];
  for (const item of menu) {
    let group = groups.find((g) => g.category === item.category);
    if (!group) {
      group = { category: item.category, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}
