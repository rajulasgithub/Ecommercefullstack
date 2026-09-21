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
  validateName,
  validatePhone,
  GENDERS,
  validateGender,
  validatePincode
} from '../utils/validation';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const googleToken = location.state?.googleToken || "";
  const googleData = location.state?.googleData || {};

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(googleData.image || null);
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");

  const [profile, setProfile] = useState({
    firstName: googleData.firstName || "",
    lastName: googleData.lastName || "",
    number: "",
    gender: "",
    state: "",
    district: "",
    place: "",
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
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
    setServerError("");
  };

  const validate = () => {
    const errs = {};

    const fnErr = validateName(profile.firstName, "First name");
    if (fnErr) errs.firstName = fnErr;

    const lnErr = validateName(profile.lastName, "Last name", 1);
    if (lnErr) errs.lastName = lnErr;

    const phoneErr = validatePhone(profile.number, "Phone number");
    if (phoneErr) errs.number = phoneErr;

    const genderErr = validateGender(profile.gender);
    if (genderErr) errs.gender = genderErr;

    if (isEmpty(profile.state)) errs.state = "State is required";
    if (isEmpty(profile.district)) errs.district = "District is required";
    if (isEmpty(profile.place)) errs.place = "Place is required";

    const pinErr = validatePincode(profile.pincode);
    if (pinErr) errs.pincode = pinErr;

    setError(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!googleToken) {
      toast.error("Google authentication session expired. Please sign in again.");
      navigate('/signup');
      return;
    }

    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("token", googleToken);
      Object.keys(profile).forEach((key) => {
        formData.append(key, profile[key]);
      });

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (googleData.image) {
        formData.append("image", googleData.image);
      }

      const response = await api.post('/auth/google-complete-user', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.success) {
        toast.success("🎉 Account registration completed successfully!");
        if (response.data.token) {
          localStorage.setItem("loginId", response.data.loginId);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("token", response.data.token);
        }
        navigate('/viewproduct');
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Profile completion failed. Please try again.";
      toast.error(msg);
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <SEO title="Complete Your Profile" description="Provide contact and delivery details to finish your TrendLife Google registration." />
      <Header />
      <div className="auth-page-container">
        <Container style={{ maxWidth: "680px" }}>
          <div className="glass-card">
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)" }}>
                {googleData.image ? (
                  <img src={googleData.image} alt="Google Avatar" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
                ) : (
                  <span style={{ fontSize: "1.2rem" }}>👤</span>
                )}
                <span style={{ fontSize: "0.85rem", color: "#a5b4fc", fontWeight: 500 }}>
                  Signed in as <strong>{googleData.email}</strong>
                </span>
              </div>
              <h1 className="page-title" style={{ fontSize: "2rem" }}>Complete Your Profile</h1>
              <p className="page-subtitle" style={{ fontSize: "0.9rem" }}>
                Almost there! Please fill in your phone number and address details for shopping & delivery.
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
                      <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "2rem", opacity: 0.5 }}>📸</span>
                    )}
                  </div>
                  <Form.Label
                    htmlFor="profile-image-upload"
                    className="btn btn-sm btn-primary rounded-circle position-absolute"
                    style={{ bottom: "0", right: "0", padding: "4px 8px", fontSize: "0.75rem", cursor: "pointer" }}
                    title="Change profile picture"
                  >
                    ✏️
                  </Form.Label>
                  <Form.Control
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="small text-muted mt-1">Profile Photo (Google avatar pre-filled)</div>
              </div>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="custom-label">First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      isInvalid={!!error.firstName}
                      className="custom-input"
                    />
                    <Form.Control.Feedback type="invalid">{error.firstName}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="custom-label">Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      isInvalid={!!error.lastName}
                      className="custom-input"
                    />
                    <Form.Control.Feedback type="invalid">{error.lastName}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="custom-label">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="number"
                      value={profile.number}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      isInvalid={!!error.number}
                      className="custom-input"
                    />
                    <Form.Control.Feedback type="invalid">{error.number}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="custom-label">Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      isInvalid={!!error.gender}
                      className="custom-input custom-select"
                    >
                      <option value="">Select Gender</option>
                      {GENDERS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{error.gender}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="custom-label">State</Form.Label>
                    <Form.Control
                      type="text"
                      name="state"
                      value={profile.state}
                      onChange={handleChange}
                      placeholder="State"
                      isInvalid={!!error.state}
                      className="custom-input"
                    />
                    <Form.Control.Feedback type="invalid">{error.state}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="custom-label">District</Form.Label>
                    <Form.Control
                      type="text"
                      name="district"
                      value={profile.district}
                      onChange={handleChange}
                      placeholder="District"
                      isInvalid={!!error.district}
                      className="custom-input"
                    />
                    <Form.Control.Feedback type="invalid">{error.district}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="custom-label">City / Place</Form.Label>
                    <Form.Control
                      type="text"
                      name="place"
                      value={profile.place}
                      onChange={handleChange}
                      placeholder="City / Area / Town"
                      isInvalid={!!error.place}
                      className="custom-input"
                    />
                    <Form.Control.Feedback type="invalid">{error.place}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="custom-label">Pincode</Form.Label>
                    <Form.Control
                      type="text"
                      name="pincode"
                      value={profile.pincode}
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
                <Form.Label className="custom-label">Bio (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Tell us a little about your fashion style..."
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
                    Completing Profile...
                  </>
                ) : (
                  "Complete Registration & Continue"
                )}
              </Button>
            </Form>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default CompleteProfile;
