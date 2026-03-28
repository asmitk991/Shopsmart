import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card" data-testid="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-card__content">
        <span className="pill">{product.category}</span>
        <div>
          <h3>{product.name}</h3>
          <p className="muted">{product.description}</p>
        </div>
        <strong className="price">Rs. {product.price}</strong>
      </div>
    </Link>
  );
}

export default ProductCard;
