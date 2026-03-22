import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Cart from './pages/Cart.jsx';
import ProductDetail from './pages/ProductDetail.jsx';

function App() {
  return (
    <CartProvider>
      <div className="app-shell">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
