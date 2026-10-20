import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import StaffPage from './pages/StaffPage.jsx';

export default function App() {
  return (
    <>
      <header>
        <Link to="/">QuickBite</Link> <Link to="/staff">Staff</Link>
      </header>
      <main>
        {/* Each feature adds its page here, e.g. <Route path="/restaurants/:id" element={<MenuPage />} /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/staff" element={<StaffPage />} />
        </Routes>
      </main>
    </>
  );
}
