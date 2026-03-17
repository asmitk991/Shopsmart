import request from 'supertest';
import app from '../src/app.js';

describe('Auth API', () => {
  it('POST /api/auth/register with missing fields returns 400', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/auth/login with wrong credentials returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });
});
