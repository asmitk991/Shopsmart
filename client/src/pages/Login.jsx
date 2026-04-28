import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      if (email === 'test@example.com' && password === 'password123') {
        window.localStorage.setItem('shopsmart-user', JSON.stringify({ email }));
        navigate('/cart');
        return;
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      window.localStorage.setItem('shopsmart-user', JSON.stringify(data.user));
      window.localStorage.setItem('shopsmart-token', data.token);
      navigate('/cart');
    } catch (err) {
      setError('Use the demo login or create the account through the API first.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-section stack">
      <div>
        <span className="pill">Welcome back</span>
        <h1 className="page-title">Sign in to continue</h1>
        <p className="muted">
          Demo credentials: <strong>test@example.com</strong> / <strong>password123</strong>
        </p>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" placeholder="you@example.com" required />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Enter password" required />
        </label>
        {error && <div className="status-banner">{error}</div>}
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}

export default Login;
