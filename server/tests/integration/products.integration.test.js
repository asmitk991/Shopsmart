import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../../src/app.js';

const prisma = new PrismaClient();

describe('Products Integration', () => {
  let createdId;

  it('creates a product via POST', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Test Product', price: 99.99, category: 'Test', stock: 10 });
    expect([200, 201]).toContain(res.statusCode);
    createdId = res.body.id;
  });

  it('reads the created product via GET', async () => {
    if (!createdId) {
      return;
    }

    const res = await request(app).get(`/api/products/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Test Product');
  });

  it('updates the product via PUT', async () => {
    if (!createdId) {
      return;
    }

    const res = await request(app).put(`/api/products/${createdId}`).send({ price: 79.99 });
    expect(res.statusCode).toBe(200);
  });

  it('deletes the product via DELETE', async () => {
    if (!createdId) {
      return;
    }

    const res = await request(app).delete(`/api/products/${createdId}`);
    expect([200, 204]).toContain(res.statusCode);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
