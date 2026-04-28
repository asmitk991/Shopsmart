import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ProductCard from '../components/ProductCard.jsx';

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Shoe',
    price: 499,
    category: 'Men',
    description: 'A comfortable test shoe',
    image: 'https://via.placeholder.com/150',
  };

  it('renders product name', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    );
    expect(screen.getByText('Test Shoe')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    );
    expect(screen.getByText(/499/)).toBeInTheDocument();
  });

  it('renders an image', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
