import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import api from '../utils/api';
import { toast } from 'react-toastify';
import Cart from '../Components/Cart';

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

const mockCartData = {
  data: [
    {
      _id: 'cartItemId1',
      quantity: 2,
      prdId: {
        _id: 'prd1',
        prdName: 'Elegant Evening Gown',
        prize: 5000,
        size: 'M',
        image: ['/test.jpg']
      }
    }
  ]
};

describe('Cart Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders empty cart state', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/cart/viewcart') return Promise.resolve({ data: { data: [] } });
      if (url === '/address/getaddress') return Promise.resolve({ data: { data: {} } });
      return Promise.reject(new Error('not mocked'));
    });

    render(<MockProviders><Cart /></MockProviders>);

    await waitFor(() => {
      expect(screen.getByText(/Your Bag is Empty/i)).toBeInTheDocument();
    });
  });

  test('renders cart items and calculates total correctly', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/cart/viewcart') return Promise.resolve({ data: mockCartData });
      if (url === '/address/getaddress') return Promise.resolve({ data: { data: {} } });
      return Promise.reject(new Error('not mocked'));
    });

    render(<MockProviders><Cart /></MockProviders>);

    await waitFor(() => {
      expect(screen.getByText(/Elegant Evening Gown/i)).toBeInTheDocument();
      // Total prize should be 5000 * 2 = 10000
      expect(screen.getAllByText(/₹10000/i)[0]).toBeInTheDocument();
    });
  });

  test('handles deleting an item from the cart', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/cart/viewcart') return Promise.resolve({ data: mockCartData });
      if (url === '/address/getaddress') return Promise.resolve({ data: { data: {} } });
      return Promise.reject(new Error('not mocked'));
    });
    api.delete.mockResolvedValueOnce({ data: { success: true } });

    render(<MockProviders><Cart /></MockProviders>);

    await waitFor(() => {
      expect(screen.getByText(/Elegant Evening Gown/i)).toBeInTheDocument();
    });

    const removeBtns = screen.getAllByRole('button', { name: /Remove/i });
    fireEvent.click(removeBtns[0]); // Click the first item's remove button

    // The modal opens and has another Remove button, which will be the last one
    const modalRemoveBtns = screen.getAllByRole('button', { name: 'Remove' });
    fireEvent.click(modalRemoveBtns[modalRemoveBtns.length - 1]);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/cart/delcartitem/cartItemId1');
      expect(toast.success).toHaveBeenCalledWith('Item removed from shopping bag');
    });
  });
});
