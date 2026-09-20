import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

jest.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
  GoogleLogin: () => <div data-testid="google-login-mock">Google Login Mock</div>
}));

// Mock the API and Toast
import api from '../utils/api';
import { toast } from 'react-toastify';

import Login from '../Components/Login';
import Signup from '../Components/Signup';

jest.mock('../utils/api');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

const MockProviders = ({ children }) => (
  <GoogleOAuthProvider clientId="test-client-id">
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </GoogleOAuthProvider>
);

describe('Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    api.get.mockResolvedValue({ data: { success: true, data: { image: '' } } });
  });

  describe('Login Component', () => {
    test('renders login form properly', () => {
      render(<MockProviders><Login /></MockProviders>);
      expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    test('shows validation errors for empty fields', async () => {
      render(<MockProviders><Login /></MockProviders>);
      const submitButton = screen.getByRole('button', { name: /Sign In/i });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Please provide a valid email address/i)).toBeInTheDocument();
        expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      });
    });

    test('submits valid form data to API', async () => {
      api.post.mockResolvedValueOnce({
        data: { success: true, loginId: '123', role: 'user', token: 'mockToken' }
      });

      render(<MockProviders><Login /></MockProviders>);

      fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'Pass123!' } });

      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/login', {
          email: 'test@test.com',
          password: 'Pass123!'
        });
        expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Signed in successfully'));
        expect(window.localStorage.getItem('token')).toBe('mockToken');
      });
    });
  });

  describe('Signup Component', () => {
    test('renders signup form fields', () => {
      render(<MockProviders><Signup /></MockProviders>);
      expect(screen.getByPlaceholderText(/e\.g\. Rahul/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e\.g\. Sharma/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    });

    test('validates matching passwords', async () => {
      api.post.mockResolvedValue({ data: { success: true } });
      render(<MockProviders><Signup /></MockProviders>);

      // Fill in passwords that don't match
      const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
      fireEvent.change(passwordInputs[0], { target: { value: 'Pass123!' } });
      fireEvent.change(passwordInputs[1], { target: { value: 'Pass1234!' } });

      fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

      await waitFor(() => {
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
      });
    });
  });
});
