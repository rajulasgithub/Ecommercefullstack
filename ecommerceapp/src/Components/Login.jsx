import React, { useState } from "react";
import "./Style.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { useNavigate, Link } from 'react-router-dom';
import Header from "./Header";
import api from "../utils/api";
import ROLES from "../utils/roles";

const Login = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (event) => {
    setLogin({ ...login, [event.target.name]: event.target.value });
    setServerError("");
  };

  const Validate = () => {
    const errormessage = {};
    if (!login.email) {
      errormessage.email = "Email address is required";
    }
    if (!login.password) {
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

    try {
      const response = await api.post("/auth/login", login);
      if (response.data && response.data.success) {
        localStorage.setItem("loginId", response.data.loginId);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.token);

        const roleNum = Number(response.data.role);
        if (roleNum === ROLES.COMPANY || roleNum === ROLES.ADMIN) {
          navigate('/vieworders');
        } else {
          navigate('/viewproduct');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
      setServerError(msg);
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
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  name="password"
                  className="glass-input"
                  value={login.password}
                  onChange={handleChange}
                />
                {error.password && <span className="glass-error-badge">{error.password}</span>}
              </Form.Group>

              <div className="d-grid mb-3">
                <Button type="submit" className="btn-glass-primary">
                  Sign In
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
