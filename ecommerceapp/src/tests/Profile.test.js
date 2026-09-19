import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import api from '../utils/api';
import Profile from '../Components/Profile';

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

const mockProfileData = {
  success: true,
  data: {
    _id: 'user1',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'j.smith@example.com',
    role: 'user',
    number: '9876543210'
  }
};

describe('Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.setItem('role', 'user');
  });

  test('renders user profile data correctly', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/auth/viewinfo') return Promise.resolve({ data: mockProfileData });
      return Promise.reject(new Error('not mocked'));
    });

    render(<MockProviders><Profile /></MockProviders>);

    await waitFor(() => {
      expect(screen.getByDisplayValue(/Jane/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/Doe/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/j.smith@example.com/i)).toBeInTheDocument();
    });
  });
});
