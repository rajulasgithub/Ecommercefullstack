import React, { useState } from 'react';
import './Style.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import { isValidEmail, isEmpty, validatePassword, validateConfirmPassword, validateName, validatePhone, GENDERS, validateGender } from '../utils/validation';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [signup, setSignup] = useState({
    firstName: "",
    lastName: "",
    number: "",
    state: "",
    district: "",
    place: "",
    pincode: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (event) => {
    setSignup({ ...signup, [event.target.name]: event.target.value });
    setError({ ...error, [event.target.name]: "" });
    setServerError("");
  };

  const Validate = () => {
    const errormessage = {};
    
    const fnErr = validateName(signup.firstName, "First name");
    if (fnErr) errormessage.firstName = fnErr;

    const lnErr = validateName(signup.lastName, "Last name", 1);
    if (lnErr) errormessage.lastName = lnErr;

    const phoneErr = validatePhone(signup.number, "Phone number");
    if (phoneErr) errormessage.number = phoneErr;

    const genderErr = validateGender(signup.gender);
    if (genderErr) errormessage.gender = genderErr;

    if (isEmpty(signup.state)) errormessage.state = "State is required";
    if (isEmpty(signup.district)) errormessage.district = "District is required";
    if (isEmpty(signup.place)) errormessage.place = "Place is required";
    if (isEmpty(signup.pincode)) errormessage.pincode = "Pincode is required";

    if (isEmpty(signup.email)) {
      errormessage.email = "Please provide a valid email address";
    } else if (!isValidEmail(signup.email)) {
      errormessage.email = "Please provide a valid email address";
    }

    const passwordErr = validatePassword(signup.password);
    if (passwordErr) {
      errormessage.password = passwordErr;
    }

    const confirmPasswordErr = validateConfirmPassword(signup.password, signup.confirmPassword);
    if (confirmPasswordErr) {
      errormessage.confirmPassword = confirmPasswordErr;
    }

    setError(errormessage);
    return Object.keys(errormessage).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!Validate()) return;

    const { confirmPassword, ...signupPayload } = signup;

    setLoading(true);
    try {
      const response = await api.post('/auth/signup', signupPayload);
      if (response.data && response.data.success) {
        if (response.data.token) {
          localStorage.setItem("loginId", response.data.loginId);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("token", response.data.token);
        }
        navigate('/viewproduct');
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <div className="auth-page-container">
        <Container style={{ maxWidth: "680px" }}>
          <div className="glass-card">
            <div className="text-center mb-4">
              <span className="status-pill ordered mb-2">Create Account</span>
              <h2 className="page-title" style={{ fontSize: "2rem" }}>Join TrendLife</h2>
              <p className="page-subtitle" style={{ fontSize: "0.9rem" }}>Sign up to enjoy personalized shopping and fast checkout</p>
            </div>

            {serverError && (
              <div className="alert alert-danger text-center mb-3" role="alert" style={{ fontSize: "0.875rem" }}>
                {serverError}
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              <Row className="g-3 mb-2">
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. Rahul"
                      name="firstName"
                      className="glass-input"
                      onChange={handleChange}
                    />
                    {error.firstName && <span className="glass-error-badge">{error.firstName}</span>}
                  </Form.Group>
                </Col>

                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. Sharma"
                      name="lastName"
                      className="glass-input"
                      onChange={handleChange}
                    />
                    {error.lastName && <span className="glass-error-badge">{error.lastName}</span>}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-2">
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. 9876543210"
                      name="number"
                      className="glass-input"
                      onChange={handleChange}
                    />
                    {error.number && <span className="glass-error-badge">{error.number}</span>}
                  </Form.Group>
                </Col>

                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      className="glass-input"
                      onChange={handleChange}
                      value={signup.gender}
                    >
                      <option value="" style={{ color: '#000' }}>Select Gender</option>
                      {GENDERS.map((item) => (
                        <option key={item} value={item} style={{ color: '#000' }}>
                          {item}
                        </option>
                      ))}
                    </Form.Select>
                    {error.gender && <span className="glass-error-badge">{error.gender}</span>}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-2">
                <Col xs={12} sm={4}>
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

                <Col xs={12} sm={4}>
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

                <Col xs={12} sm={4}>
                  <Form.Group>
                    <Form.Label className="glass-label">Place</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Place"
                      name="place"
                      className="glass-input"
                      onChange={handleChange}
                    />
                    {error.place && <span className="glass-error-badge">{error.place}</span>}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-2">
                <Col xs={12} sm={12}>
                  <Form.Group>
                    <Form.Label className="glass-label">Pincode</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. 682001"
                      name="pincode"
                      className="glass-input"
                      onChange={handleChange}
                    />
                    {error.pincode && <span className="glass-error-badge">{error.pincode}</span>}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-2">
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label className="glass-label">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
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
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>

              <div className="text-center mt-3" style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#a5b4fc", textDecoration: "none", fontWeight: 600 }}>
                  Sign In
                </Link>
              </div>
            </Form>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Signup;