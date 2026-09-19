import React, { useState, useEffect } from "react";
import "./Style.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";
import Header from "./Header";
import api from "../utils/api";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [serverError, setServerError] = useState("");
  const [generatingBio, setGeneratingBio] = useState(false);

  const role = localStorage.getItem("role");
  const userRole = role ? String(role).toLowerCase() : "user";
  const isSeller = userRole === "seller" || userRole === "company";

  const fetchProfile = async () => {
    setLoading(true);
    setServerError("");
    try {
      const response = await api.get("/auth/viewinfo");
      if (response.data && response.data.success) {
        const data = response.data.data;
        setProfile(data);
        setFormData(data);
        if (data.image) {
          setImagePreview(data.image);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load profile details.";
      toast.error(msg);
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setServerError("");
  };

  const handleGenerateBio = async () => {
    setGeneratingBio(true);
    try {
      const payload = isSeller ? {
        companyName: formData.companyName,
        state: formData.state,
        district: formData.district,
      } : {
        firstName: formData.firstName,
        lastName: formData.lastName,
        state: formData.state,
        place: formData.place,
      };

      const response = await api.post('/auth/generate-bio', payload);
      if (response.data && response.data.success) {
        const bio = response.data.data.bio;
        setFormData(prev => ({ ...prev, bio }));
        toast.success("Bio generated successfully!");
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to generate bio.';
      toast.error(msg);
    } finally {
      setGeneratingBio(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSeller && formData.gstNumber) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/i;
      if (!gstRegex.test(String(formData.gstNumber).trim())) {
        const msg = "Please enter a valid 15-digit GSTIN (e.g. 22AAAAA0000A1Z5)";
        toast.error(msg);
        setServerError(msg);
        return;
      }
    }

    setSaving(true);
    setServerError("");

    try {
      let response;
      if (imageFile) {
        const payload = new FormData();
        payload.append("image", imageFile);
        if (isSeller) {
          payload.append("companyName", formData.companyName || "");
          payload.append("contactNumber", formData.contactNumber || "");
          payload.append("regNumber", formData.regNumber || "");
          payload.append("gstNumber", formData.gstNumber || "");
          payload.append("state", formData.state || "");
          payload.append("district", formData.district || "");
          payload.append("pincode", formData.pincode || "");
        } else {
          payload.append("firstName", formData.firstName || "");
          payload.append("lastName", formData.lastName || "");
          payload.append("number", formData.number || "");
          payload.append("gender", formData.gender || "");
          payload.append("place", formData.place || "");
          payload.append("state", formData.state || "");
          payload.append("district", formData.district || "");
          payload.append("pincode", formData.pincode || "");
        }

        response = await api.put("/auth/updateprofile", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await api.put("/auth/updateprofile", formData);
      }

      if (response.data && response.data.success) {
        toast.success("🎉 Profile updated successfully!");
        setProfile(response.data.data);
        setFormData(response.data.data);
        setIsEditing(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update profile.";
      toast.error(msg);
      setServerError(msg);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (isSeller) {
      return (profile.companyName || "S")[0].toUpperCase();
    }
    const first = (profile.firstName || "U")[0];
    const last = (profile.lastName || "")[0] || "";
    return (first + last).toUpperCase();
  };

  return (
    <div className="page-container">
      <Header />
      <div className="auth-page-container">
        <Container style={{ maxWidth: "800px" }}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" variant="light" />
              <p className="mt-3 text-light">Loading profile details...</p>
            </div>
          ) : (
            <div className="glass-card">
              {/* Header Badge & Profile Summary */}
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-between pb-4 border-bottom border-secondary mb-4 gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="profile-avatar-box position-relative d-flex align-items-center justify-content-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile Avatar"
                        className="profile-avatar-img w-100 h-100"
                        style={{ objectFit: "cover" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <span
                      className="profile-avatar-initials"
                      style={{ display: imagePreview ? "none" : "flex" }}
                    >
                      {getInitials()}
                    </span>
                  </div>
                  <div>
                    <span className={`status-pill ${isSeller ? "processing" : "active"} mb-1 d-inline-block`}>
                      {isSeller ? "Seller / Company Account" : "Customer Account"}
                    </span>
                    <h2 className="page-title mb-0" style={{ fontSize: "1.6rem" }}>
                      {isSeller
                        ? profile.companyName || "Company Profile"
                        : `${profile.firstName || "User"} ${profile.lastName || ""}`}
                    </h2>
                    <p className="page-subtitle mb-0" style={{ fontSize: "0.85rem" }}>
                      {profile.email}
                    </p>
                  </div>
                </div>

                <div>
                  {!isEditing ? (
                    <Button
                      className="btn-glass-primary px-4"
                      onClick={() => setIsEditing(true)}
                    >
                      ✏️ Edit Profile
                    </Button>
                  ) : (
                    <Button
                      variant="outline-light"
                      className="px-3"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(profile);
                        setServerError("");
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              {serverError && (
                <div className="alert alert-danger text-center mb-4" role="alert">
                  {serverError}
                </div>
              )}

              {/* Form Content */}
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  {/* Account Email (Always Disabled/Readonly) */}
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label className="glass-label">Email Address (Account ID)</Form.Label>
                      <Form.Control
                        type="email"
                        value={profile.email || ""}
                        disabled
                        className="glass-input opacity-75"
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label className="glass-label">Account Role</Form.Label>
                      <Form.Control
                        type="text"
                        value={isSeller ? "Seller Partner" : "Customer"}
                        disabled
                        className="glass-input opacity-75 text-capitalize"
                      />
                    </Form.Group>
                  </Col>

                  {/* Seller Specific Fields */}
                  {isSeller ? (
                    <>
                      {isEditing && (
                        <Col xs={12}>
                          <Form.Group>
                            <Form.Label className="glass-label">Update Company Logo</Form.Label>
                            <Form.Control
                              type="file"
                              accept="image/*"
                              className="glass-input"
                              onChange={handleFileChange}
                            />
                          </Form.Group>
                        </Col>
                      )}

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="glass-label">Company Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="companyName"
                            value={formData.companyName || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="glass-input"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="glass-label">Contact Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="contactNumber"
                            value={formData.contactNumber || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="glass-input"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="glass-label">Registration Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="regNumber"
                            value={formData.regNumber || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="glass-input"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="glass-label">GSTIN Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="gstNumber"
                            value={formData.gstNumber || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="glass-input"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={4}>
                        <Form.Group>
                          <Form.Label className="glass-label">State</Form.Label>
                          <Form.Control
                            type="text"
                            name="state"
                            value={formData.state || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="glass-input"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={4}>
                        <Form.Group>
                          <Form.Label className="glass-label">District</Form.Label>
                          <Form.Control
                            type="text"
                            name="district"
                            value={formData.district || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="glass-input"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={4}>
                        <Form.Group>
                          <Form.Label className="glass-label">Pincode</Form.Label>
                          <Form.Control
                            type="text"
                            name="pincode"
                            value={formData.pincode || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="glass-input"
                          />
                        </Form.Group>
                      </Col>
                    </>
                  ) : (
                    /* Customer Specific Fields */
                    <>
                      {isEditing && (
                        <Col xs={12}>
                          <Form.Group>
                            <Form.Label className="glass-label">Update Profile Picture</Form.Label>
                            <Form.Control
                              type="file"
                              accept="image/*"
                              className="glass-input"
                              onChange={handleFileChange}
                            />
                          </Form.Group>
                        </Col>
                      )}

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="glass-label">First Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="glass-input"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="glass-label">Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="glass-input"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="glass-label">Phone Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="number"
                            value={formData.number || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="glass-input"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="glass-label">Gender</Form.Label>
                          <Form.Select
                            name="gender"
                            value={formData.gender || "Male"}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="glass-input"
                          >
                            <option value="Male" style={{ background: "#1e293b" }}>Male</option>
                            <option value="Female" style={{ background: "#1e293b" }}>Female</option>
                            <option value="Other" style={{ background: "#1e293b" }}>Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="glass-label">Place / Locality</Form.Label>
                          <Form.Control
                            type="text"
                            name="place"
                            value={formData.place || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="glass-input"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="glass-label">State</Form.Label>
                          <Form.Control
                            type="text"
                            name="state"
                            value={formData.state || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="glass-input"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="glass-label">District</Form.Label>
                          <Form.Control
                            type="text"
                            name="district"
                            value={formData.district || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="glass-input"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="glass-label">Pincode</Form.Label>
                          <Form.Control
                            type="text"
                            name="pincode"
                            value={formData.pincode || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="glass-input"
                          />
                        </Form.Group>
                      </Col>
                    </>
                  )}
                  <Col xs={12}>
                    <Form.Group className="mb-2">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Form.Label className="glass-label mb-0">Profile Bio</Form.Label>
                        {isEditing && (
                          <Button 
                            variant="outline-light" 
                            size="sm" 
                            className="d-flex align-items-center gap-2"
                            onClick={handleGenerateBio}
                            disabled={generatingBio}
                            style={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.3)' }}
                          >
                            {generatingBio ? (
                              <><Spinner as="span" animation="border" size="sm" /> Generating...</>
                            ) : (
                              "✨ Generate with AI"
                            )}
                          </Button>
                        )}
                      </div>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="bio"
                        value={formData.bio || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="glass-input"
                        placeholder="Tell us a bit about yourself..."
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {isEditing && (
                  <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top border-secondary">
                    <Button
                      variant="outline-light"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(profile);
                        setServerError("");
                      }}
                      disabled={saving}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      className="btn-glass-primary px-4"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                          Saving Changes...
                        </>
                      ) : (
                        "Save Profile Changes"
                      )}
                    </Button>
                  </div>
                )}
              </Form>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Profile;
