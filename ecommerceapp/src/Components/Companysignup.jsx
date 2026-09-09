import React, { useState } from 'react';
import './Style.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import api from './../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';

const Companysignup = () => {
  const navigate = useNavigate();
  const [companysignup, setCompanysignup] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (event) => {
    setCompanysignup({ ...companysignup, [event.target.name]: event.target.value });
    setServerError("");
  };

  const fileChange = (event) => {
    setCompanysignup({ ...companysignup, image: event.target.files[0] });
    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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

    try {
      const response = await api.post('/auth/companysignup', formdata);
      if (response.data && response.data.success) {
        if (response.data.token) {
          localStorage.setItem("loginId", response.data.loginId);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("token", response.data.token);
        }
        navigate('/vieworders');
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Company registration failed. Please try again.";
      setServerError(msg);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <div className="auth-page-container">
        <Container style={{ maxWidth: "700px" }}>
          <div className="glass-card">
            <div className="text-center mb-4">
              <span className="status-pill processing mb-2">Seller Portal</span>
              <h2 className="page-title" style={{ fontSize: "2rem" }}>Company Registration</h2>
              <p className="page-subtitle" style={{ fontSize: "0.9rem" }}>Partner with TrendLife to showcase your apparel collections</p>
            </div>

            {serverError && (
              <div className="alert alert-danger text-center mb-3" role="alert" style={{ fontSize: "0.875rem" }}>
                {serverError}
              </div>
            )}

            <Form onSubmit={handleSubmit} encType="multipart/form-data">
              <Row className="g-3 mb-2">
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="glass-label">Company Logo / Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      className="glass-input"
                      onChange={fileChange}
                    />
                  </Form.Group>
                </Col>

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
                  </Form.Group>
                </Col>

                <Col xs={12} sm={4}>
                  <Form.Group>
                    <Form.Label className="glass-label">Pincode</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Pincode"
                      name="pincode"
                      className="glass-input"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-2">
                <Col xs={12} sm={4}>
                  <Form.Group>
                    <Form.Label className="glass-label">Contact Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Contact Number"
                      name="contactNumber"
                      className="glass-input"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} sm={4}>
                  <Form.Group>
                    <Form.Label className="glass-label">Registration No.</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Reg Number"
                      name="regNumber"
                      className="glass-input"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} sm={4}>
                  <Form.Group>
                    <Form.Label className="glass-label">GST Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="GSTIN Number"
                      name="gstNumber"
                      className="glass-input"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-4">
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
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid mb-3">
                <Button type="submit" className="btn-glass-primary">
                  Register Company
                </Button>
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