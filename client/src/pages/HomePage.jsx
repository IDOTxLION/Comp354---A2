import { useEffect, useState } from 'react';

// Placeholder: PBI-01 replaces this with the restaurant list.
export default function HomePage() {
  const [message, setMessage] = useState('Connecting to the server...');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setMessage(`Server is up with ${data.restaurants} restaurants.`))
      .catch(() => setMessage('Could not reach the server.'));
  }, []);

  return (
    <>
      <h1>Order ahead, pick up on time</h1>
      <p>{message}</p>
    </>
  );
}
