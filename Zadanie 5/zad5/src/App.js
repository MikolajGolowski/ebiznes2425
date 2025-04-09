import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Products from './components/Products';
import Cart from './components/Cart';
import Payments from './components/Payments';
import { StoreProvider } from './context/StoreContext';

function App() {
  return (
    <div className="App">
      <StoreProvider>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Produkty</Link>
            </li>
            <li>
              <Link to="/cart">Koszyk</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>
      </Router>
    </StoreProvider>
    </div>
  );
}

export default App;
