import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';

export default function App() {
  return (
    <>
      <header>
        <Link to="/">QuickBite</Link>
      </header>
      <main>
        {/* Each feature adds its page here, e.g. <Route path="/restaurants/:id" element={<MenuPage />} /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>
    </>
  );
}
