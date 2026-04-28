import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCartContext } from '../context/CartContext.jsx';

function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCartContext();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${id}`);

        if (!response.ok) {
          throw new Error('Product not found');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError('We could not find that product.');
      }
    }

    loadProduct();
  }, [id]);

  if (error) {
    return (
      <main className="page-section stack">
        <div className="status-banner">{error}</div>
        <Link className="button secondary" to="/">
          Back to catalog
        </Link>
      </main>
    );
  }

  if (!product) {
    return <main className="status-banner">Loading product details...</main>;
  }

  return (
    <main className="page-section detail-layout">
      <img src={product.image} alt={product.name} />
      <div className="stack">
        <span className="pill">{product.category}</span>
        <h1 className="page-title">{product.name}</h1>
        <p className="muted">{product.description}</p>
        <strong className="price">Rs. {product.price}</strong>
        <p className="muted">In stock: {product.stock}</p>
        <div className="actions">
          <button className="button" onClick={() => addItem(product)}>
            Add to cart
          </button>
          <Link className="button secondary" to="/cart">
            View cart
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;
