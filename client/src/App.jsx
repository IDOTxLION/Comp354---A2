import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';

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
        </Routes>
      </main>
    </>
  );
}
