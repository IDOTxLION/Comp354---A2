import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import MenuPage from './pages/MenuPage.jsx';

export default function App() {
  return (
    <>
      <header>
        <Link to="/">QuickBite</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants/:id" element={<MenuPage />} />
        </Routes>
      </main>
    </>
  );
}
