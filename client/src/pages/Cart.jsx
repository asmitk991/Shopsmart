import { useCartContext } from '../context/CartContext.jsx';

function Cart() {
  const { items, removeItem, total } = useCartContext();

  return (
    <main className="page-section stack" data-testid="cart-container">
      <div>
        <span className="pill">Your basket</span>
        <h1 className="page-title">Cart</h1>
        <p className="muted">Review your selected items before heading to checkout.</p>
      </div>

      {items.length === 0 ? (
        <div className="status-banner">Your cart is empty. Add a product from the homepage.</div>
      ) : (
        <div className="cart-list">
          {items.map((item) => (
            <article key={item.id} className="cart-item">
              <div>
                <h3>{item.name}</h3>
                <p className="muted">Quantity: {item.quantity || 1}</p>
              </div>
              <div className="actions">
                <strong className="price">Rs. {item.price}</strong>
                <button className="button secondary" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="panel page-section">
        <strong>Total</strong>
        <div className="price">Rs. {total}</div>
      </div>
    </main>
  );
}

export default Cart;
