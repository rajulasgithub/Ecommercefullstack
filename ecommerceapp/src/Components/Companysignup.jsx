import React, { useState } from 'react';
import './Style.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import api from './../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from './Header';
import SEO from './SEO';
import { GoogleLogin } from '@react-oauth/google';
import { isValidEmail, isEmpty, validatePassword, validateConfirmPassword, validatePhone, validateRegNumber, validateGstNumber, validateCompanyName, validatePincode } from '../utils/validation';

const Companysignup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companysignup, setCompanysignup] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (event) => {
    setCompanysignup({ ...companysignup, [event.target.name]: event.target.value });
    setError({ ...error, [event.target.name]: "" });
    setServerError("");
  };

  const fileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCompanysignup({ ...companysignup, image: file });
      setImagePreview(URL.createObjectURL(file));
      setError({ ...error, image: "" });
      setServerError("");
    }
  };

  const Validate = () => {
    const errormessage = {};
    if (!companysignup.image) errormessage.image = "Company logo/image is required";
    const companyNameErr = validateCompanyName(companysignup.companyName);
    if (companyNameErr) errormessage.companyName = companyNameErr;
    if (isEmpty(companysignup.state)) errormessage.state = "State is required";
    if (isEmpty(companysignup.district)) errormessage.district = "District is required";

    const pinErr = validatePincode(companysignup.pincode);
    if (pinErr) errormessage.pincode = pinErr;

    const contactErr = validatePhone(companysignup.contactNumber, "Contact number");
    if (contactErr) errormessage.contactNumber = contactErr;

    const regErr = validateRegNumber(companysignup.regNumber);
    if (regErr) errormessage.regNumber = regErr;

    const gstErr = validateGstNumber(companysignup.gstNumber);
    if (gstErr) errormessage.gstNumber = gstErr;

    if (isEmpty(companysignup.email)) {
      errormessage.email = "Please provide a valid email address";
    } else if (!isValidEmail(companysignup.email)) {
      errormessage.email = "Please provide a valid email address";
    }

    const passwordErr = validatePassword(companysignup.password);
    if (passwordErr) {
      errormessage.password = passwordErr;
    }

    const confirmPasswordErr = validateConfirmPassword(companysignup.password, companysignup.confirmPassword);
    if (confirmPasswordErr) {
      errormessage.confirmPassword = confirmPasswordErr;
    }

    setError(errormessage);
    return Object.keys(errormessage).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!Validate()) return;

    const formdata = new FormData();
    if (companysignup.image) formdata.append("image", companysignup.image);
    formdata.append("companyName", companysignup.companyName || "");
    formdata.append("state", companysignup.state || "");
    formdata.append("district", companysignup.district || "");
    formdata.append("pincode", companysignup.pincode || "");
    formdata.append("contactNumber", companysignup.contactNumber || "");
    formdata.append("regNumber", companysignup.regNumber || "");
    formdata.append("gstNumber", companysignup.gstNumber || "");
    formdata.append("email", companysignup.email || "");
    formdata.append("password", companysignup.password || "");

    setLoading(true);
    try {
      const response = await api.post('/auth/companysignup', formdata);
      if (response.data && response.data.success) {
        toast.success("🎉 Seller account created successfully!");
        if (response.data.token) {
          localStorage.setItem("loginId", response.data.loginId);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("token", response.data.token);
        }
        navigate('/sellerdashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Company registration failed. Please try again.";
      toast.error(msg);
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/google-company", {
        token: credentialResponse.credential,
      });
      if (response.data && response.data.success) {
        if (!response.data.isProfileComplete) {
          toast.info("Please complete your company details to finish seller setup.");
          navigate('/complete-seller-profile', {
            state: {
              googleToken: response.data.googleToken,
              googleData: response.data.googleData,
            },
          });
          return;
        }

        localStorage.setItem("loginId", response.data.loginId);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.token);

        toast.success("🎉 Welcome! Registered seller account with Google successfully.");
        navigate('/sellerdashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Google Seller Signup failed. Please try again.";
      toast.error(msg);
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <SEO
        title="Become a Seller"
        description="Register as a seller or merchant partner on TrendLife to list and sell your fashion and apparel collections to millions of customers."
      />
      <Header />
      <div className="auth-page-container">
        <Container style={{ maxWidth: "680px" }}>
          <div className="glass-card">
            <div className="text-center mb-4">
              <h1 className="page-title" style={{ fontSize: "2rem" }}>Company Registration</h1>
              <p className="page-subtitle" style={{ fontSize: "0.9rem" }}>Partner with TrendLife to showcase your apparel collections</p>
            </div>

            {serverError && (
              <div className="alert alert-danger text-center mb-3" role="alert" style={{ fontSize: "0.875rem" }}>
                {serverError}
              </div>
            )}

            <Form onSubmit={handleSubmit} encType="multipart/form-data">
              <Row className="g-3 mb-3 justify-content-center">
                <Col xs={12} className="text-center">
                  <Form.Group className="d-flex flex-column align-items-center">
                    <div className="position-relative" style={{ width: "100px", height: "100px" }}>
                      <label htmlFor="company-logo-upload" style={{ cursor: "pointer", display: "block", width: "100%", height: "100%" }}>
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.4)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                          />
                        ) : (
                          <div style={{ width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", border: "2px dashed rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease" }} className="avatar-placeholder">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="17 8 12 3 7 8"></polyline>
                              <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                          </div>
                        )}
                      </label>
                      <Form.Control
                        id="company-logo-upload"
                        type="file"
                        name="image"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={fileChange}
                      />
                    </div>
                    <Form.Label className="glass-label d-block mt-2 mb-0">Company Logo / Image</Form.Label>
                    {error.image && <span className="glass-error-badge mt-1">{error.image}</span>}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-2">
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. Acme Fashion Ltd"
                      name="companyName"
                      className="glass-input"
                      onChange={handleChange}
                    />
                    {error.companyName && <span className="glass-error-badge">{error.companyName}</span>}
                  </Form.Group>
                </Col>

                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">Contact Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Contact Number"
                      name="contactNumber"
                      className="glass-input"
                      onChange={handleChange}
                    />
                    {error.contactNumber && <span className="glass-error-badge">{error.contactNumber}</span>}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-2">
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">State</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="State"
                      name="state"
                      className="glass-input"
                      onChange={handleChange}
                    />
                    {error.state && <span className="glass-error-badge">{error.state}</span>}
                  </Form.Group>
                </Col>

                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">District</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="District"
                      name="district"
                      className="glass-input"
                      onChange={handleChange}
                    />
                    {error.district && <span className="glass-error-badge">{error.district}</span>}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-2">
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">Registration No.</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Reg Number"
                      name="regNumber"
                      className="glass-input"
                      onChange={handleChange}
                    />
                    {error.regNumber && <span className="glass-error-badge">{error.regNumber}</span>}
                  </Form.Group>
                </Col>

                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">GST Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="22AAAAA0000A1Z5"
                      name="gstNumber"
                      className="glass-input text-uppercase"
                      onChange={handleChange}
                    />
                    {error.gstNumber && <span className="glass-error-badge">{error.gstNumber}</span>}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-2">
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">Pincode</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Pincode"
                      name="pincode"
                      className="glass-input"
                      onChange={handleChange}
                    />
                    {error.pincode && <span className="glass-error-badge">{error.pincode}</span>}
                  </Form.Group>
                </Col>

                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">Business Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="company@example.com"
                      name="email"
                      className="glass-input"
                      onChange={handleChange}
                    />
                    {error.email && <span className="glass-error-badge">{error.email}</span>}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-4">
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">Password</Form.Label>
                    <div className="password-input-wrapper">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        name="password"
                        className="glass-input"
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
                </Col>

                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">Confirm Password</Form.Label>
                    <div className="password-input-wrapper">
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        name="confirmPassword"
                        className="glass-input"
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        title={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? (
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
                    {error.confirmPassword && <span className="glass-error-badge">{error.confirmPassword}</span>}
                  </Form.Group>
                </Col>
              </Row>

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
                      Registering Company...
                    </>
                  ) : (
                    "Register Company"
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
                    toast.error('Google Seller Signup Failed');
                    setServerError('Google Seller Signup Failed');
                  }}
                  useOneTap
                  theme="filled_black"
                  shape="rectangular"
                  text="signup_with"
                  size="large"
                />
              </div>

              <div className="text-center mt-3" style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
                Already registered?{" "}
                <Link to="/login" style={{ color: "#a5b4fc", textDecoration: "none", fontWeight: 600 }}>
                  Seller Login
                </Link>
              </div>
            </Form>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Companysignup;