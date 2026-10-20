import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/restaurants')
      .then((res) => res.json())
      .then(setRestaurants)
      .catch(() => setError('Could not load restaurants.'));
  }, []);

  return (
    <>
      <h1>Restaurants</h1>
      <RestaurantList restaurants={restaurants} error={error} />
    </>
  );
}

function RestaurantList({ restaurants, error }) {
  if (error) return <p>{error}</p>;
  if (!restaurants) return <p>Loading...</p>;
  if (restaurants.length === 0) return <p>No restaurants available yet.</p>;

  return (
    <ul>
      {restaurants.map((restaurant) => (
        <li key={restaurant.id}>
          <Link to={`/restaurants/${restaurant.id}`}>{restaurant.name}</Link>
          {' '}{restaurant.cuisine}, {restaurant.opens_at} to {restaurant.closes_at}
        </li>
      ))}
    </ul>
  );
}
