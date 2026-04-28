import prisma from './prisma.js';

const sampleProducts = [
  {
    name: 'Nimbus Runner',
    description: 'Breathable daily trainer built for comfort and long walks.',
    price: 89.99,
    category: 'Footwear',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    stock: 24,
  },
  {
    name: 'Metro Carry Pack',
    description: 'Compact commuter backpack with laptop sleeve and quick-access pockets.',
    price: 64.5,
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    stock: 16,
  },
  {
    name: 'Studio Bottle',
    description: 'Insulated stainless steel bottle that keeps drinks cold all day.',
    price: 24.99,
    category: 'Lifestyle',
    image:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
    stock: 40,
  },
];

let seedPromise;

export async function ensureSeedData() {
  if (!seedPromise) {
    seedPromise = (async () => {
      const count = await prisma.product.count();

      if (count === 0) {
        await prisma.product.createMany({
          data: sampleProducts,
        });
      }
    })().catch((error) => {
      seedPromise = undefined;
      throw error;
    });
  }

  await seedPromise;
}
