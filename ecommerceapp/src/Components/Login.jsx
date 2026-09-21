import React, { useState } from "react";
import "./Style.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import Header from "./Header";
import SEO from "./SEO";
import api from "../utils/api";
import { isValidEmail, isEmpty } from "../utils/validation";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
    setServerError("");
  };

  const validate = () => {
    const errs = {};
    if (isEmpty(login.email) || !isValidEmail(login.email)) {
      errs.email = "Please provide a valid email address";
    }

    if (isEmpty(login.password)) {
      errs.password = "Password is required";
    }

    setError(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    api.post("/auth/login", login)
      .then((response) => {
        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("loginId", response.data.loginId);

          toast.success("Welcome back! Signed in successfully.");
          const userRole = String(response.data.role).toLowerCase();
          if (userRole === "admin") {
            navigate("/admindashboard");
          } else if (userRole === "seller" || userRole === "company") {
            navigate("/sellerdashboard");
          } else {
            navigate("/viewproduct");
          }
        }
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Invalid credentials. Please try again.";
        toast.error(msg);
        setServerError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      toast.error("Google Login failed to retrieve credentials.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });

      if (response.data.success) {
        if (!response.data.isProfileComplete) {
          toast.info("Please complete your profile details to finish sign up.");
          navigate('/complete-profile', {
            state: {
              googleToken: response.data.googleToken,
              googleData: response.data.googleData,
            },
          });
          return;
        }

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("loginId", response.data.loginId);

        toast.success("Google Login successful! Welcome.");
        const userRole = String(response.data.role).toLowerCase();
        if (userRole === "admin") {
          navigate("/admindashboard");
        } else if (userRole === "seller" || userRole === "company") {
          navigate("/sellerdashboard");
        } else {
          navigate("/viewproduct");
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Google Login failed. Please try again.";
      toast.error(msg);
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <SEO
        title="Account Sign In"
        description="Sign in to your TrendLife account to access your shopping bag, order history, wishlist, and profile."
      />
      <Header />
      <div className="auth-page-container">
        <Container style={{ maxWidth: "480px" }}>
          <div className="glass-card">
            <div className="text-center mb-4">
              <span className="status-pill ordered mb-2">Welcome Back</span>
              <h1 className="page-title" style={{ fontSize: "2rem" }}>Sign In to TrendLife</h1>
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
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <Form.Label className="glass-label mb-0">Password</Form.Label>
                  <Link to="/forgot-password" style={{ color: "#a5b4fc", fontSize: "0.8rem", textDecoration: "none", fontWeight: 500 }}>
                    Forgot Password?
                  </Link>
                </div>
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

              <div className="d-flex align-items-center my-4">
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                <span style={{ margin: '0 10px', color: '#9ca3af', fontSize: '0.85rem' }}>OR</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
              </div>

              <div className="d-flex justify-content-center mb-3">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error('Google Login Failed');
                    setServerError('Google Login Failed');
                  }}
                  useOneTap
                  theme="filled_black"
                  shape="rectangular"
                  text="signin_with"
                  size="large"
                />
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
