import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Components/Header';
import '@testing-library/jest-dom';

describe('Header Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure a clean state
    window.localStorage.clear();
  });

  test('renders Header with TrendLife brand', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const brandElement = screen.getByText(/TrendLife/i);
    expect(brandElement).toBeInTheDocument();
  });

  test('renders public links by default when not logged in', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Shop Catalog/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
  });

  test('toggles theme when theme button is clicked', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // By default, the theme in Header is 'dark' if localStorage is empty
    const themeButtonDark = screen.getByTitle(/Switch to Light Mode/i);
    expect(themeButtonDark).toBeInTheDocument();

    // Click the button to toggle to light mode
    fireEvent.click(themeButtonDark);

    // Check if the localStorage was updated
    expect(window.localStorage.getItem('theme')).toBe('light');

    // Check if the button text/title changed
    const themeButtonLight = screen.getByTitle(/Switch to Dark Mode/i);
    expect(themeButtonLight).toBeInTheDocument();
  });
});
