import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { ensureSeedData } from '../lib/seed.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    await ensureSeedData();
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' },
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await ensureSeedData();
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, price, category, stock = 0, description = '', image = '' } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({ message: 'name, price, and category are required' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        category,
        stock: Number(stock),
        description,
        image,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        name: req.body.name ?? existing.name,
        price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
        category: req.body.category ?? existing.category,
        stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock,
        description: req.body.description ?? existing.description,
        image: req.body.image ?? existing.image,
      },
    });

    return res.json(product);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await prisma.product.delete({
      where: { id: Number(req.params.id) },
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
