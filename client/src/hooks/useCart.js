import { useEffect, useState } from 'react';

const STORAGE_KEY = 'shopsmart-cart';

function readInitialItems() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState(readInitialItems);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  function addItem(product) {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) }
            : item
        );
      }

      return [...currentItems, { ...product, quantity: product.quantity || 1 }];
    });
  }

  function removeItem(id) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return {
    items,
    addItem,
    removeItem,
    total,
  };
}
