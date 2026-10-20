import { Link } from 'react-router-dom';
import { useOrder } from './OrderContext.jsx';
import { formatPrice } from './format.js';

export default function OrderSummary() {
  const { order, setQuantity, removeItem } = useOrder();
  const total = order.items.reduce((sum, item) => sum + item.price_cents * item.quantity, 0);

  if (order.items.length === 0) {
    return (
      <section>
        <h2>Your order</h2>
        <p>Your order is empty</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Your order</h2>
      <ul>
        {order.items.map((item) => (
          <li key={item.menu_item_id}>
            {item.name}{' '}
            <button onClick={() => setQuantity(item.menu_item_id, item.quantity - 1)}>-</button>{' '}
            {item.quantity}{' '}
            <button onClick={() => setQuantity(item.menu_item_id, item.quantity + 1)}>+</button>{' '}
            {formatPrice(item.price_cents * item.quantity)}{' '}
            <button onClick={() => removeItem(item.menu_item_id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: {formatPrice(total)}</p>
      <Link to="/checkout">Checkout</Link>
    </section>
  );
}
