import React, { useState, useEffect } from "react";
import "./Header.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from 'react-router-dom';
import ROLES from "../utils/roles";

const Header = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const data = localStorage.getItem("role");
    setRole(data ? Number(data) : null);
  }, []);

  const logout = () => {
    localStorage.clear();
    setRole(null);
    navigate("/login");
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="header-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="header-brand">
          TrendLife
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto align-items-lg-center gap-1">
            <Nav.Link as={Link} to="/" className="header-nav-link">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/viewproduct" className="header-nav-link">
              Shop Products
            </Nav.Link>

            {role === ROLES.USER ? (
              <>
                <Nav.Link as={Link} to="/cart" className="header-nav-link">
                  View Cart
                </Nav.Link>
                <Nav.Link as={Link} to="/vieworders" className="header-nav-link">
                  My Orders
                </Nav.Link>
                <Nav.Link as={Link} to="#" className="header-nav-link text-danger" onClick={logout}>
                  Logout
                </Nav.Link>
              </>
            ) : role === ROLES.COMPANY || role === ROLES.ADMIN ? (
              <>
                <Nav.Link as={Link} to="/addproduct" className="header-nav-link">
                  Add Product
                </Nav.Link>
                <Nav.Link as={Link} to="/vieworders" className="header-nav-link">
                  Manage Orders
                </Nav.Link>
                <Nav.Link as={Link} to="#" className="header-nav-link text-danger" onClick={logout}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="header-nav-link me-lg-1">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className="header-cta-link">
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
