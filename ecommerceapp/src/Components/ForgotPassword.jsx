import React, { useState } from "react";
import "./Style.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "./Header";
import api from "../utils/api";
import { isValidEmail, isEmpty } from "../utils/validation";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");

  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    setServerError("");

    if (isEmpty(email)) {
      setError({ email: "Email address is required" });
      return;
    }
    if (!isValidEmail(email)) {
      setError({ email: "Please enter a valid email address" });
      return;
    }

    setError({});
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", { email });
      if (response.data && response.data.success) {
        toast.success("Verification code sent to your email!");
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send reset code. Please check your email.";
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
              <span className="status-pill pending mb-2">Step 1 of 2</span>
              <h2 className="page-title" style={{ fontSize: "1.8rem" }}>Forgot Password</h2>
              <p className="page-subtitle" style={{ fontSize: "0.85rem" }}>
                Enter your registered account email to receive a 6-digit verification code.
              </p>
            </div>

            {serverError && (
              <div className="alert alert-danger text-center mb-3" role="alert" style={{ fontSize: "0.875rem" }}>
                {serverError}
              </div>
            )}

            <Form onSubmit={handleRequestOtp}>
              <Form.Group className="mb-4">
                <Form.Label className="glass-label">Account Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  className="glass-input"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError({});
                    setServerError("");
                  }}
                />
                {error.email && <span className="glass-error-badge">{error.email}</span>}
              </Form.Group>

              <div className="d-grid mb-3">
                <Button type="submit" className="btn-glass-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      Sending Code...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3" style={{ fontSize: "0.875rem" }}>
                <Link to="/reset-password" style={{ color: "#a5b4fc", textDecoration: "none", fontWeight: 500 }}>
                  Already have a code?
                </Link>
                <Link to="/login" style={{ color: "#9ca3af", textDecoration: "none" }}>
                  Back to Login
                </Link>
              </div>
            </Form>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ForgotPassword;
