import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error('Unable to load products');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('We could not load the catalog right now.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="stack">
      <section className="hero">
        <span className="pill">Curated picks</span>
        <h1>Shop lighter, choose smarter.</h1>
        <p>
          Browse a focused catalog of everyday essentials with fast checkout flows and clear product
          details.
        </p>
      </section>

      {loading && <div className="status-banner">Loading the latest products...</div>}
      {error && <div className="status-banner">{error}</div>}

      {!loading && !error && (
        <section className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}

export default Home;
