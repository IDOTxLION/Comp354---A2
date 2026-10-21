import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import StaffPage from './pages/StaffPage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderStatusPage from './pages/OrderStatusPage.jsx';

export default function App() {
  return (
    <>
      <header>
        <Link to="/">QuickBite</Link> <Link to="/staff">Staff</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/restaurants/:id" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/:id" element={<OrderStatusPage />} />
        </Routes>
      </main>
    </>
  );
}
