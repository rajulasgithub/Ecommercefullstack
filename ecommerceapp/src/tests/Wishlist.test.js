import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import api from '../utils/api';
import { toast } from 'react-toastify';
import Wishlist from '../Components/Wishlist';

jest.mock('../utils/api');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

const MockProviders = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

const mockWishlistData = [
  {
    _id: 'wishlistItem1',
    prdId: {
      _id: 'prod1',
      prdName: 'Elegant Evening Gown',
      prize: 1299,
      stock: 'In Stock',
      image: ['/images/gown.jpg']
    }
  }
];

describe('Wishlist Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.setItem('token', 'mockToken');
    api.get.mockImplementation((url) => {
      if (url === '/wishlist/view') return Promise.resolve({ data: { success: true, data: mockWishlistData } });
      if (url === '/auth/viewinfo') return Promise.resolve({ data: { success: true, data: {} } });
      return Promise.resolve({ data: {} });
    });
    api.delete.mockResolvedValue({ data: { success: true } });
    api.post.mockResolvedValue({ data: { success: true } });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  test('renders empty wishlist correctly', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/wishlist/view') return Promise.resolve({ data: { success: true, data: [] } });
      if (url === '/auth/viewinfo') return Promise.resolve({ data: { success: true, data: {} } });
      return Promise.resolve({ data: {} });
    });

    render(<MockProviders><Wishlist /></MockProviders>);

    await waitFor(() => {
      expect(screen.getByText(/Your wishlist is empty/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Discover Products/i })).toBeInTheDocument();
    });
  });

  test('renders wishlist items correctly', async () => {
    render(<MockProviders><Wishlist /></MockProviders>);

    await waitFor(() => {
      expect(screen.getByText(/Elegant Evening Gown/i)).toBeInTheDocument();
      expect(screen.getByText(/₹1299/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Move to Bag/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Remove/i })).toBeInTheDocument();
    });
  });

  test('handles removing an item from wishlist', async () => {
    render(<MockProviders><Wishlist /></MockProviders>);

    await waitFor(() => {
      expect(screen.getByText(/Elegant Evening Gown/i)).toBeInTheDocument();
    });

    const removeBtn = screen.getByRole('button', { name: /Remove/i });
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/wishlist/remove/wishlistItem1');
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Removed from wishlist!'));
    });
  });

  test('handles moving an item to cart', async () => {
    render(<MockProviders><Wishlist /></MockProviders>);

    await waitFor(() => {
      expect(screen.getByText(/Elegant Evening Gown/i)).toBeInTheDocument();
    });

    const moveToBagBtn = screen.getByRole('button', { name: /Move to Bag/i });
    fireEvent.click(moveToBagBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/cart/addtocart', { productId: 'prod1' });
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Added to shopping bag!'));
      expect(api.delete).toHaveBeenCalledWith('/wishlist/remove/wishlistItem1'); // Removes from wishlist after adding to cart
    });
  });
});
