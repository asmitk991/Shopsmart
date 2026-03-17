import request from 'supertest';
import app from '../src/app.js';

describe('Cart API (unauthenticated)', () => {
  it('GET /api/cart without token returns 401', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.statusCode).toBe(401);
  });
});
