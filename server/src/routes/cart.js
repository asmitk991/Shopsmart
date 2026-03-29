import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { id: 'asc' },
    });

    res.json(
      items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: item.product,
      }))
    );
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: Number(productId),
        },
      },
      update: {
        quantity: {
          increment: Number(quantity),
        },
      },
      create: {
        userId: req.user.id,
        productId: Number(productId),
        quantity: Number(quantity),
      },
      include: {
        product: true,
      },
    });

    return res.status(201).json(cartItem);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const item = await prisma.cartItem.findFirst({
      where: {
        id: Number(req.params.id),
        userId: req.user.id,
      },
    });

    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await prisma.cartItem.delete({
      where: { id: item.id },
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
