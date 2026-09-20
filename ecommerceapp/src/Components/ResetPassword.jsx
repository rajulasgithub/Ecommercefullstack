import React, { useState, useEffect } from "react";
import "./Style.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "./Header";
import SEO from "./SEO";
import api from "../utils/api";
import { isValidEmail, isEmpty, validatePassword, validateConfirmPassword } from "../utils/validation";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 15 Minutes Countdown Timer (900 seconds)
  const [timeLeft, setTimeLeft] = useState(900);
  const [isExpired, setIsExpired] = useState(false);

  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Countdown timer effect
  useEffect(() => {
    if (isVerified) return; // Stop timer once code is verified

    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isVerified]);

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Stage 1: Verify OTP Code
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setServerError("");

    if (isExpired) {
      setServerError("The verification code has expired. Please click 'Resend Code' to get a new code.");
      toast.error("Code expired. Please request a new code.");
      return;
    }

    const errObj = {};
    if (isEmpty(email)) {
      errObj.email = "Account email is required";
    } else if (!isValidEmail(email)) {
      errObj.email = "Please enter a valid email address";
    }

    if (isEmpty(otp)) {
      errObj.otp = "6-digit verification code is required";
    }

    if (Object.keys(errObj).length > 0) {
      setError(errObj);
      return;
    }

    setError({});
    setLoading(true);

    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      if (response.data && response.data.success) {
        toast.success("Verification code confirmed! Please enter your new password.");
        setIsVerified(true);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid or expired verification code.";
      toast.error(msg);
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Stage 2: Reset Password (after OTP is verified)
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    setServerError("");

    const errObj = {};
    const passErr = validatePassword(newPassword);
    if (passErr) {
      errObj.newPassword = passErr;
    }

    const confirmErr = validateConfirmPassword(newPassword, confirmPassword);
    if (confirmErr) {
      errObj.confirmPassword = confirmErr;
    }

    if (Object.keys(errObj).length > 0) {
      setError(errObj);
      return;
    }

    setError({});
    setLoading(true);

    try {
      const response = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      if (response.data && response.data.success) {
        toast.success("🎉 Password reset successful! You can now log in.");
        navigate("/login");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Password reset failed. Please try again.";
      toast.error(msg);
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isEmpty(email) || !isValidEmail(email)) {
      toast.error("Please provide a valid email address to resend the code.");
      return;
    }
    setResendLoading(true);
    setServerError("");
    try {
      const response = await api.post("/auth/forgot-password", { email });
      if (response.data && response.data.success) {
        toast.success("A new 6-digit verification code has been sent to your email!");
        setTimeLeft(900); // Reset 15-minute countdown
        setIsExpired(false);
        setOtp("");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend code. Please try again.";
      toast.error(msg);
      setServerError(msg);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="page-container">
      <SEO title="Reset Password" noindex={true} />
      <Header />
      <div className="auth-page-container">
        <Container style={{ maxWidth: "480px" }}>
          <div className="glass-card">
            <div className="text-center mb-4">
              <span className={`status-pill ${isVerified ? "active" : isExpired ? "shipped" : "ordered"} mb-2`}>
                {isVerified ? "Code Verified ✓" : isExpired ? "Code Expired ✖" : "Step 2 of 2"}
              </span>
              <h1 className="page-title" style={{ fontSize: "1.8rem" }}>
                {isVerified ? "Set New Password" : "Verify Reset Code"}
              </h1>
              <p className="page-subtitle" style={{ fontSize: "0.85rem" }}>
                {isVerified
                  ? "Your identity is verified. Enter your new password below."
                  : "Enter the 6-digit code sent to your email to unlock the password reset."}
              </p>
            </div>

            {serverError && (
              <div className="alert alert-danger text-center mb-3" role="alert" style={{ fontSize: "0.875rem" }}>
                {serverError}
              </div>
            )}

            {!isVerified ? (
              /* Stage 1: Verify OTP Code */
              <Form onSubmit={handleVerifyOtp}>
                <Form.Group className="mb-3">
                  <Form.Label className="glass-label">Account Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    className="glass-input"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError({ ...error, email: "" });
                      setServerError("");
                    }}
                  />
                  {error.email && <span className="glass-error-badge">{error.email}</span>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Label className="glass-label mb-0">6-Digit Verification Code</Form.Label>
                    <span style={{ fontSize: "0.8rem", fontWeight: "600", color: isExpired ? "#ef4444" : "#f97316" }}>
                      {isExpired ? "Expired" : `Expires in ${formatTime(timeLeft)}`}
                    </span>
                  </div>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 123456"
                    value={otp}
                    maxLength={6}
                    disabled={isExpired}
                    className="glass-input text-center"
                    style={{ letterSpacing: "4px", fontSize: "1.2rem", fontWeight: "700" }}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setError({ ...error, otp: "" });
                      setServerError("");
                    }}
                  />
                  {error.otp && <span className="glass-error-badge">{error.otp}</span>}
                </Form.Group>

                {isExpired && (
                  <div className="p-2 mb-3 text-center" style={{ background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                    <span style={{ color: "#ef4444", fontSize: "0.85rem" }}>
                      ⚠️ Verification code has expired. Please click <strong>Resend Code</strong> below.
                    </span>
                  </div>
                )}

                <div className="d-grid mb-3">
                  <Button type="submit" className="btn-glass-primary" disabled={loading || isExpired}>
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        Verifying Code...
                      </>
                    ) : (
                      "Verify Code"
                    )}
                  </Button>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3" style={{ fontSize: "0.85rem" }}>
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none p-0"
                    style={{ color: "#a5b4fc", fontSize: "0.85rem", fontWeight: isExpired ? "700" : "500" }}
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                  >
                    {resendLoading ? "Resending..." : "Resend Code"}
                  </button>
                  <Link to="/login" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    Back to Login
                  </Link>
                </div>
              </Form>
            ) : (
              /* Stage 2: Reset Password (Only shown after code verification) */
              <Form onSubmit={handleResetPassword}>
                <div className="p-3 mb-3 text-center" style={{ background: "rgba(16, 185, 129, 0.1)", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                  <span style={{ color: "#10b981", fontSize: "0.9rem", fontWeight: "600" }}>
                    ✓ Verification Successful for {email}
                  </span>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label className="glass-label">New Password</Form.Label>
                  <div className="password-input-wrapper">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      className="glass-input"
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError({ ...error, newPassword: "" });
                        setServerError("");
                      }}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {error.newPassword && <span className="glass-error-badge">{error.newPassword}</span>}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="glass-label">Confirm New Password</Form.Label>
                  <div className="password-input-wrapper">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      className="glass-input"
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError({ ...error, confirmPassword: "" });
                        setServerError("");
                      }}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {error.confirmPassword && <span className="glass-error-badge">{error.confirmPassword}</span>}
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button type="submit" className="btn-glass-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        Resetting Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </div>

                <div className="text-center mt-3" style={{ fontSize: "0.85rem" }}>
                  <Link to="/login" style={{ color: "#9ca3af", textDecoration: "none" }}>
                    Back to Login
                  </Link>
                </div>
              </Form>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ResetPassword;
