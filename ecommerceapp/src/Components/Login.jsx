import React, { useState } from "react";
import "./Style.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from "./Header";
import api from "../utils/api";
import ROLES from "../utils/roles";
import { isValidEmail, isEmpty } from "../utils/validation";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (event) => {
    setLogin({ ...login, [event.target.name]: event.target.value });
    setError({ ...error, [event.target.name]: "" });
    setServerError("");
  };

  const Validate = () => {
    const errormessage = {};
    if (isEmpty(login.email)) {
      errormessage.email = "Please provide a valid email address";
    } else if (!isValidEmail(login.email)) {
      errormessage.email = "Please provide a valid email address";
    }

    if (isEmpty(login.password)) {
      errormessage.password = "Password is required";
    }
    setError(errormessage);
    return Object.keys(errormessage).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!Validate()) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", login);
      if (response.data && response.data.success) {
        localStorage.setItem("loginId", response.data.loginId);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.token);

        toast.success("Welcome back! Signed in successfully.");
        const userRole = String(response.data.role || '').toLowerCase();
        if (userRole === "seller" || userRole === "company" || userRole === "admin" || userRole.includes("seller")) {
          navigate('/vieworders');
        } else {
          navigate('/viewproduct');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(msg);
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <div className="auth-page-container">
        <Container style={{ maxWidth: "480px" }}>
          <div className="glass-card">
            <div className="text-center mb-4">
              <span className="status-pill ordered mb-2">Welcome Back</span>
              <h2 className="page-title" style={{ fontSize: "2rem" }}>Sign In to TrendLife</h2>
              <p className="page-subtitle" style={{ fontSize: "0.9rem" }}>Access your account securely</p>
            </div>

            {serverError && (
              <div className="alert alert-danger text-center mb-3" role="alert" style={{ fontSize: "0.875rem" }}>
                {serverError}
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="glass-label">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  className="glass-input"
                  value={login.email}
                  onChange={handleChange}
                />
                {error.email && <span className="glass-error-badge">{error.email}</span>}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="glass-label">Password</Form.Label>
                <div className="password-input-wrapper">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    name="password"
                    className="glass-input"
                    value={login.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
                {error.password && <span className="glass-error-badge">{error.password}</span>}
              </Form.Group>

              <div className="d-grid mb-3">
                <Button type="submit" className="btn-glass-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>

              <div className="text-center mt-3" style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
                Don't have an account?{" "}
                <Link to="/signup" style={{ color: "#a5b4fc", textDecoration: "none", fontWeight: 600 }}>
                  Create Account
                </Link>
              </div>
            </Form>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Login;
