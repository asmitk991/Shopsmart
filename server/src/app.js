import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.js';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import { ensureSeedData } from './lib/seed.js';

process.env.JWT_SECRET ??= 'local-dev-secret';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service');
});

app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res) => {
  console.error(error);
  res.status(500).json({
    message: 'Internal server error',
  });
});

ensureSeedData().catch((error) => {
  console.error('Failed to seed initial products', error);
});

export default app;
