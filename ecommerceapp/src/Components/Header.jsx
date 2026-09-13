import React, { useState, useEffect } from "react";
import "./Header.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ROLES from "../utils/roles";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(localStorage.getItem("role"));
  const itemCount = localStorage.getItem("itemcount") || 0;

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const data = localStorage.getItem("role");
    setRole(data || null);
  }, [location]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const logout = () => {
    localStorage.clear();
    setRole(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar collapseOnSelect expand="lg" className="header-navbar">
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/" className="header-brand d-flex align-items-center gap-2">
          <span className="header-logo-icon">✨</span>
          <span className="header-brand-text">TrendLife</span>
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="custom-toggler" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto align-items-lg-center gap-lg-2 py-2 py-lg-0">
            {/* Primary Navigation Links */}
            <Nav.Link
              as={Link}
              to="/"
              className={`header-nav-link ${isActive("/") || isActive("/home") ? "active" : ""}`}
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/viewproduct"
              className={`header-nav-link ${isActive("/viewproduct") ? "active" : ""}`}
            >
              Shop Catalog
            </Nav.Link>

            {/* Role-Based Links */}
            {role === ROLES.USER ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/cart"
                  className={`header-nav-link ${isActive("/cart") ? "active" : ""}`}
                >
                  Shopping Bag
                  {Number(itemCount) > 0 && (
                    <span className="cart-badge-dot ms-2">{itemCount}</span>
                  )}
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/vieworders"
                  className={`header-nav-link ${isActive("/vieworders") ? "active" : ""}`}
                >
                  My Orders
                </Nav.Link>

                <div className="header-divider d-none d-lg-block mx-1"></div>

                <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0 ms-lg-2">
                  <span className="role-user-badge">
                    <span className="user-dot"></span> Account
                  </span>
                  <button className="btn-header-logout" onClick={logout}>
                    Logout
                  </button>
                </div>
              </>
            ) : role === ROLES.COMPANY || role === ROLES.ADMIN ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/addproduct"
                  className={`header-nav-link ${isActive("/addproduct") ? "active" : ""}`}
                >
                  + Add Product
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/vieworders"
                  className={`header-nav-link ${isActive("/vieworders") ? "active" : ""}`}
                >
                  Manage Orders
                </Nav.Link>

                <div className="header-divider d-none d-lg-block mx-1"></div>

                <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0 ms-lg-2">
                  <span className="role-seller-badge">
                    <span className="seller-dot"></span> Seller Portal
                  </span>
                  <button className="btn-header-logout" onClick={logout}>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/companysignup"
                  className={`header-nav-link header-seller-link ${isActive("/companysignup") ? "active" : ""}`}
                >
                  Become a Seller
                </Nav.Link>

                <div className="header-divider d-none d-lg-block mx-1"></div>

                <Nav.Link
                  as={Link}
                  to="/login"
                  className={`header-login-btn me-lg-1 ${isActive("/login") ? "active" : ""}`}
                >
                  Sign In
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/signup"
                  className="header-cta-link text-center mt-2 mt-lg-0"
                >
                  Create Account
                </Nav.Link>
              </>
            )}

            {/* Theme Toggle Button */}
            <button
              type="button"
              className="btn-theme-toggle ms-lg-2 my-2 my-lg-0"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
