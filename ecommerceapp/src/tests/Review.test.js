import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import api from '../utils/api';
import { toast } from 'react-toastify';
import SingleProduct from '../Components/SingleProduct';

jest.mock('../utils/api');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

// Mock useParams to return a specific product ID
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'prod1' })
}));

const MockProviders = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

const mockProduct = {
  _id: 'prod1',
  prdName: 'Floral Summer Dress',
  prize: 1299,
  stock: 'In Stock',
  category: 'Women',
  style: 'Casual Wear',
  description: 'A beautiful floral dress.',
  size: 'M, L',
  material: 'Cotton',
  image: ['/images/floral.jpg']
};

const mockReviewsData = {
  success: true,
  data: [
    {
      _id: 'review1',
      loginId: 'user2',
      user: { firstName: 'Alice', lastName: 'Smith' },
      rating: 4,
      comment: 'Great dress, fits well!',
      createdAt: '2023-10-01T12:00:00Z'
    }
  ],
  averageRating: 4,
  totalReviews: 1,
  ratingDistribution: { 5: 0, 4: 1, 3: 0, 2: 0, 1: 0 }
};

const mockEligibilityData = {
  success: true,
  canReview: true,
  hasPurchased: true,
  alreadyReviewed: false,
  userReview: null
};

describe('SingleProduct Component (Reviews)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.setItem('token', 'mockToken');
    window.localStorage.setItem('loginId', 'user1');
    window.localStorage.setItem('role', 'user');

    api.get.mockImplementation((url) => {
      if (url === '/product/viewone/prod1') return Promise.resolve({ data: { success: true, data: mockProduct } });
      if (url === '/review/product/prod1') return Promise.resolve({ data: mockReviewsData });
      if (url === '/review/eligibility/prod1') return Promise.resolve({ data: mockEligibilityData });
      if (url === '/auth/viewinfo') return Promise.resolve({ data: { success: true, data: {} } });
      return Promise.resolve({ data: {} });
    });
    
    api.post.mockResolvedValue({ data: { success: true, message: 'Review submitted successfully!' } });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  test('renders product reviews correctly', async () => {
    render(<MockProviders><SingleProduct /></MockProviders>);

    await waitFor(() => {
      expect(screen.getByText(/Customer Reviews & Ratings/i)).toBeInTheDocument();
      expect(screen.getByText(/Alice Smith/i)).toBeInTheDocument();
      expect(screen.getByText(/Great dress, fits well!/i)).toBeInTheDocument();
    });
  });

  test('shows review submission form if user is eligible', async () => {
    render(<MockProviders><SingleProduct /></MockProviders>);

    await waitFor(() => {
      expect(screen.getByText(/Write a Review/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Submit Review/i })).toBeInTheDocument();
    });
  });

  test('handles submitting a new review', async () => {
    render(<MockProviders><SingleProduct /></MockProviders>);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Submit Review/i })).toBeInTheDocument();
    });

    const commentInput = screen.getByPlaceholderText(/Write your thoughts/i);
    fireEvent.change(commentInput, { target: { value: 'Absolutely love it!' } });

    // The rating is 5 by default, so we can just submit
    const submitBtn = screen.getByRole('button', { name: /Submit Review/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/review/add', {
        productId: 'prod1',
        rating: 5,
        comment: 'Absolutely love it!'
      });
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Review submitted successfully!'));
    });
  });
});
