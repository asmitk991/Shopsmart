import { NavLink } from 'react-router-dom';
import { useCartContext } from '../context/CartContext.jsx';

function Header() {
  const { items } = useCartContext();
  const navClassName = ({ isActive }) => (isActive ? 'active' : undefined);

  return (
    <header className="header">
      <NavLink to="/" className="brand">
        ShopSmart
      </NavLink>
      <nav className="nav" aria-label="Main navigation">
        <NavLink to="/" className={navClassName}>
          Home
        </NavLink>
        <NavLink to="/login" className={navClassName}>
          Login
        </NavLink>
        <NavLink to="/cart" className={navClassName}>
          Cart ({items.length})
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
