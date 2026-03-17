import request from 'supertest';
import app from '../src/app.js';

describe('Products API', () => {
  it('GET /api/products returns an array', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/products/:id with invalid id returns 404', async () => {
    const res = await request(app).get('/api/products/999999');
    expect(res.statusCode).toBe(404);
  });
});
