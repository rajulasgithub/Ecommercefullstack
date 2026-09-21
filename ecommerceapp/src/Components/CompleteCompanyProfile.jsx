import React, { useState } from 'react';
import './Style.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from './Header';
import SEO from './SEO';
import api from '../utils/api';
import {
  isEmpty,
  validateCompanyName,
  validatePhone,
  validateRegNumber,
  validateGstNumber,
  validatePincode
} from '../utils/validation';

const CompleteCompanyProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const googleToken = location.state?.googleToken || "";
  const googleData = location.state?.googleData || {};

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(googleData.image || null);
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");

  const [company, setCompany] = useState({
    companyName: googleData.companyName || "",
    contactNumber: "",
    regNumber: "",
    gstNumber: "",
    state: "",
    district: "",
    pincode: "",
    bio: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany({
      ...company,
      [name]: name === "gstNumber" ? value.toUpperCase() : value,
    });
    setError({ ...error, [name]: "" });
    setServerError("");
  };

  const validate = () => {
    const errs = {};

    const nameErr = validateCompanyName(company.companyName);
    if (nameErr) errs.companyName = nameErr;

    const contactErr = validatePhone(company.contactNumber, "Contact number");
    if (contactErr) errs.contactNumber = contactErr;

    const regErr = validateRegNumber(company.regNumber);
    if (regErr) errs.regNumber = regErr;

    const gstErr = validateGstNumber(company.gstNumber);
    if (gstErr) errs.gstNumber = gstErr;

    if (isEmpty(company.state)) errs.state = "State is required";
    if (isEmpty(company.district)) errs.district = "District is required";

    const pinErr = validatePincode(company.pincode);
    if (pinErr) errs.pincode = pinErr;

    setError(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!googleToken) {
      toast.error("Google authentication session expired. Please sign in again.");
      navigate('/companysignup');
      return;
    }

    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("token", googleToken);
      Object.keys(company).forEach((key) => {
        formData.append(key, company[key]);
      });

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (googleData.image) {
        formData.append("image", googleData.image);
      }

      const response = await api.post('/auth/google-complete-company', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.success) {
        toast.success("🎉 Seller profile setup completed successfully!");
        if (response.data.token) {
          localStorage.setItem("loginId", response.data.loginId);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("token", response.data.token);
        }
        navigate('/sellerdashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Company profile completion failed. Please try again.";
      toast.error(msg);
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <SEO title="Complete Business Profile" description="Provide business registration and tax details to complete your TrendLife Seller Google setup." />
      <Header />
      <div className="auth-page-container">
        <Container style={{ maxWidth: "680px" }}>
          <div className="glass-card">
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)" }}>
                {googleData.image ? (
                  <img src={googleData.image} alt="Google Avatar" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
                ) : (
                  <span style={{ fontSize: "1.2rem" }}>🏬</span>
                )}
                <span style={{ fontSize: "0.85rem", color: "#a5b4fc", fontWeight: 500 }}>
                  Signed in as <strong>{googleData.email}</strong>
                </span>
              </div>
              <h1 className="page-title" style={{ fontSize: "2rem" }}>Complete Seller Profile</h1>
              <p className="page-subtitle" style={{ fontSize: "0.9rem" }}>
                Partner with TrendLife! Complete your company registration & tax info to open your store.
              </p>
            </div>

            {serverError && (
              <div className="alert alert-danger text-center mb-3" role="alert" style={{ fontSize: "0.875rem" }}>
                {serverError}
              </div>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <div
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "2px dashed rgba(255, 255, 255, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      margin: "0 auto",
                    }}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Company Logo Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "2rem", opacity: 0.5 }}>🏬</span>
                    )}
                  </div>
                  <Form.Label
                    htmlFor="company-image-upload"
                    className="btn btn-sm btn-primary rounded-circle position-absolute"
                    style={{ bottom: "0", right: "0", padding: "4px 8px", fontSize: "0.75rem", cursor: "pointer" }}
                    title="Upload Company Logo"
                  >
                    ✏️
                  </Form.Label>
                  <Form.Control
                    id="company-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="small text-muted mt-1">Company Logo</div>
              </div>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="custom-label">Company / Brand Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="companyName"
                      value={company.companyName}
                      onChange={handleChange}
                      placeholder="e.g. TrendLife Apparels Pvt Ltd"
                      isInvalid={!!error.companyName}
                      className="custom-input"
                    />
                    <Form.Control.Feedback type="invalid">{error.companyName}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="custom-label">Business Contact Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="contactNumber"
                      value={company.contactNumber}
                      onChange={handleChange}
                      placeholder="10-digit contact number"
                      maxLength={10}
                      isInvalid={!!error.contactNumber}
                      className="custom-input"
                    />
                    <Form.Control.Feedback type="invalid">{error.contactNumber}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="custom-label">Registration Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="regNumber"
                      value={company.regNumber}
                      onChange={handleChange}
                      placeholder="Business Reg / CIN Number"
                      isInvalid={!!error.regNumber}
                      className="custom-input"
                    />
                    <Form.Control.Feedback type="invalid">{error.regNumber}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="custom-label">GST Number (GSTIN)</Form.Label>
                    <Form.Control
                      type="text"
                      name="gstNumber"
                      value={company.gstNumber}
                      onChange={handleChange}
                      placeholder="15-digit GSTIN (e.g. 22AAAAA0000A1Z5)"
                      maxLength={15}
                      isInvalid={!!error.gstNumber}
                      className="custom-input text-uppercase"
                    />
                    <Form.Control.Feedback type="invalid">{error.gstNumber}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="custom-label">State</Form.Label>
                    <Form.Control
                      type="text"
                      name="state"
                      value={company.state}
                      onChange={handleChange}
                      placeholder="State"
                      isInvalid={!!error.state}
                      className="custom-input"
                    />
                    <Form.Control.Feedback type="invalid">{error.state}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="custom-label">District</Form.Label>
                    <Form.Control
                      type="text"
                      name="district"
                      value={company.district}
                      onChange={handleChange}
                      placeholder="District"
                      isInvalid={!!error.district}
                      className="custom-input"
                    />
                    <Form.Control.Feedback type="invalid">{error.district}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="custom-label">Pincode</Form.Label>
                    <Form.Control
                      type="text"
                      name="pincode"
                      value={company.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      isInvalid={!!error.pincode}
                      className="custom-input"
                    />
                    <Form.Control.Feedback type="invalid">{error.pincode}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="custom-label">Company Bio / Description (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="bio"
                  value={company.bio}
                  onChange={handleChange}
                  placeholder="Tell buyers about your fashion brand & catalog..."
                  className="custom-input"
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 custom-btn py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Completing Business Setup...
                  </>
                ) : (
                  "Complete Business Registration"
                )}
              </Button>
            </Form>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default CompleteCompanyProfile;
