import React, { useState, useEffect } from "react";
import "./Header.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from "../utils/api";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(localStorage.getItem("role"));
  const itemCount = localStorage.getItem("itemcount") || 0;
  const [userImage, setUserImage] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const data = localStorage.getItem("role");
    setRole(data || null);

    const token = localStorage.getItem("token");
    if (token) {
      api.get("/auth/viewinfo")
        .then((res) => {
          if (res.data?.success && res.data?.data?.image) {
            setUserImage(res.data.data.image);
          }
        })
        .catch(() => { });
    } else {
      setUserImage(null);
    }
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
          <img
            src={process.env.PUBLIC_URL + "/favicon.png"}
            alt="TrendLife Logo"
            className="header-logo-img"
          />
          <span className="header-brand-text">TrendLife</span>
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="custom-toggler" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto align-items-lg-center gap-lg-2 py-2 py-lg-0">
            {/* Primary Public Navigation Links (Always Visible) */}
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

            {/* Conditional Navigation Links Based on Role */}
            {(() => {
              const userRole = role ? String(role).toLowerCase() : null;

              if (userRole === "user") {
                return (
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
                      to="/wishlist"
                      className={`header-nav-link ${isActive("/wishlist") ? "active" : ""}`}
                    >
                      ❤️ Wishlist
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/vieworders"
                      className={`header-nav-link ${isActive("/vieworders") ? "active" : ""}`}
                    >
                      My Orders
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/profile"
                      className={`header-nav-link d-inline-flex align-items-center gap-1 ${isActive("/profile") ? "active" : ""}`}
                    >
                      {userImage ? (
                        <img
                          src={userImage}
                          alt="Avatar"
                          style={{ width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover" }}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        "👤 "
                      )}
                      My Profile
                    </Nav.Link>

                    <div className="header-divider d-none d-lg-block mx-1"></div>

                    <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0 ms-lg-2">
                      <span className="role-user-badge" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
                        <span className="user-dot"></span> Customer Account
                      </span>
                      <button className="btn-header-logout" onClick={logout}>
                        Logout
                      </button>
                    </div>
                  </>
                );
              }

              if (userRole === "admin") {
                return (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/admindashboard"
                      className={`header-nav-link ${isActive("/admindashboard") ? "active" : ""}`}
                      style={{ color: "#fcd34d", fontWeight: 700 }}
                    >
                      👑 Admin Dashboard
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/sellerdashboard"
                      className={`header-nav-link ${isActive("/sellerdashboard") ? "active" : ""}`}
                    >
                      📊 Seller Dashboard
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/profile"
                      className={`header-nav-link d-inline-flex align-items-center gap-1 ${isActive("/profile") ? "active" : ""}`}
                    >
                      {userImage ? (
                        <img
                          src={userImage}
                          alt="Avatar"
                          style={{ width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover" }}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        "👤 "
                      )}
                      My Profile
                    </Nav.Link>

                    <div className="header-divider d-none d-lg-block mx-1"></div>

                    <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0 ms-lg-2">
                      <span className="role-seller-badge" onClick={() => navigate("/admindashboard")} style={{ cursor: "pointer", background: "rgba(245, 158, 11, 0.2)", color: "#fcd34d", borderColor: "rgba(245, 158, 11, 0.4)" }}>
                        <span className="seller-dot" style={{ background: "#fcd34d", boxShadow: "0 0 8px #fcd34d" }}></span> Admin Portal
                      </span>
                      <button className="btn-header-logout" onClick={logout}>
                        Logout
                      </button>
                    </div>
                  </>
                );
              }

              if (userRole === "seller" || userRole === "company") {
                return (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/sellerdashboard"
                      className={`header-nav-link ${isActive("/sellerdashboard") ? "active" : ""}`}
                    >
                      📊 Seller Dashboard
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/profile"
                      className={`header-nav-link d-inline-flex align-items-center gap-1 ${isActive("/profile") ? "active" : ""}`}
                    >
                      {userImage ? (
                        <img
                          src={userImage}
                          alt="Avatar"
                          style={{ width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover" }}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        "👤 "
                      )}
                      My Profile
                    </Nav.Link>

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
                      to="/wishlist"
                      className={`header-nav-link ${isActive("/wishlist") ? "active" : ""}`}
                    >
                      ❤️ Wishlist
                    </Nav.Link>

                    <div className="header-divider d-none d-lg-block mx-1"></div>

                    <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0 ms-lg-2">
                      <span className="role-seller-badge" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
                        <span className="seller-dot"></span> Seller Portal
                      </span>
                      <button className="btn-header-logout" onClick={logout}>
                        Logout
                      </button>
                    </div>
                  </>
                );
              }

              // Public / Unauthenticated Guest Links
              return (
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
              );
            })()}

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
