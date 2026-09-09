import React, { useState } from 'react';
import './Style.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';

const Signup = () => {
  const navigate = useNavigate();

  const [signup, setSignup] = useState({
    firstname: "",
    number: "",
    state: "",
    district: "",
    place: "",
    pincode: "",
    gender: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (event) => {
    setSignup({ ...signup, [event.target.name]: event.target.value });
    setServerError("");
  };

  const Validate = () => {
    const errormessage = {};
    if (!signup.firstname) errormessage.firstname = "Firstname is required";
    if (!signup.number) errormessage.number = "Phone number is required";
    if (!signup.state) errormessage.state = "State is required";
    if (!signup.district) errormessage.district = "District is required";
    if (!signup.place) errormessage.place = "Place is required";
    if (!signup.pincode) errormessage.pincode = "Pincode is required";
    if (!signup.gender) errormessage.gender = "Gender is required";
    if (!signup.email) errormessage.email = "Email is required";
    if (!signup.password) errormessage.password = "Password is required";

    setError(errormessage);
    return Object.keys(errormessage).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!Validate()) return;

    try {
      const response = await api.post('/auth/signup', signup);
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
                      name="firstname"
                      className="glass-input"
                      onChange={handleChange}
                    />
                    {error.firstname && <span className="glass-error-badge">{error.firstname}</span>}
                  </Form.Group>
                </Col>

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
                <Col xs={12} sm={6}>
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

                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      className="glass-input"
                      onChange={handleChange}
                    >
                      <option value="" style={{ color: '#000' }}>Select Gender</option>
                      <option value="Male" style={{ color: '#000' }}>Male</option>
                      <option value="Female" style={{ color: '#000' }}>Female</option>
                      <option value="Other" style={{ color: '#000' }}>Other</option>
                    </Form.Select>
                    {error.gender && <span className="glass-error-badge">{error.gender}</span>}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-4">
                <Col xs={12} sm={6}>
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

                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="••••••••"
                      name="password"
                      className="glass-input"
                      onChange={handleChange}
                    />
                    {error.password && <span className="glass-error-badge">{error.password}</span>}
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid mb-3">
                <Button type="submit" className="btn-glass-primary">
                  Create Account
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