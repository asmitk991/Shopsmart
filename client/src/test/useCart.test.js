import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCart } from '../hooks/useCart.js';

describe('useCart hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts with empty cart', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toHaveLength(0);
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addItem({ id: 1, name: 'Shoe', price: 100 });
    });
    expect(result.current.items).toHaveLength(1);
  });

  it('calculates total correctly', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addItem({ id: 1, name: 'Shoe', price: 100 });
      result.current.addItem({ id: 2, name: 'Bag', price: 50 });
    });
    expect(result.current.total).toBe(150);
  });
});
