import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import api from '../utils/api';
import Viewproduct from '../Components/Viewproduct';

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

const mockProductData = {
  data: [
    {
      _id: 'prd1',
      prdName: 'Floral Summer Dress',
      category: 'Women',
      style: 'Casual Wear',
      prize: 2500,
      stock: 'In Stock',
      size: 'S, M, L',
      image: ['/img1.jpg']
    }
  ],
  pagination: {
    total: 1,
    page: 1,
    limit: 8,
    totalPages: 1
  }
};

describe('Products Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders products grid with fetched data', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/product/viewproduct') return Promise.resolve({ data: mockProductData });
      return Promise.reject(new Error('not mocked'));
    });

    render(<MockProviders><Viewproduct /></MockProviders>);

    await waitFor(() => {
      expect(screen.getByText(/Floral Summer Dress/i)).toBeInTheDocument();
      expect(screen.getByText(/₹2500/i)).toBeInTheDocument();
    });
  });

  test('shows empty state when no products found', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/product/viewproduct') return Promise.resolve({ data: { data: [], pagination: {} } });
      return Promise.reject(new Error('not mocked'));
    });

    render(<MockProviders><Viewproduct /></MockProviders>);

    await waitFor(() => {
      expect(screen.getByText(/No Products Found/i)).toBeInTheDocument();
    });
  });
});
