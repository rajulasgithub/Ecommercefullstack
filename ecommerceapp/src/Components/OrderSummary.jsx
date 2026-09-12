import React, { useEffect, useState } from 'react';
import './Style.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Header from './Header';
import api from '../utils/api';

const OrderSummary = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [address, setAddress] = useState({});
  const [shippingaddress, setShippingAddress] = useState({});
  const [shippinginfo, setShippinginfo] = useState({});
  const [selectedPayment, setSelectedPayment] = useState("cod");

  useEffect(() => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const exptdeliverydate = (`${day + 5}-${month}-${year}`);
    localStorage.setItem("expdeliverydate", exptdeliverydate);
    
    const itemTotal = JSON.parse(localStorage.getItem('totalprize')) || 0;
    localStorage.setItem('total', itemTotal + 40);

    api.get('/address/getaddress')
      .then((response) => {
        setShippingAddress(response.data.data || {});
      })
      .catch((error) => console.log(error));

    api.get('/auth/viewinfo')
      .then((response) => {
        setShippinginfo(response.data.data || {});
      })
      .catch((error) => console.log(error));
  }, []);

  const conformOrder = () => {
    const ordertime = Date.now();
    localStorage.setItem("orderedtime", ordertime);

    api.put('/cart/updatecart', {})
      .then((response) => {
        navigate('/vieworders');
      })
      .catch((error) => console.log(error));
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (event) => {
    setAddress({ ...address, [event.target.name]: event.target.value });
  };

  const updateAdrress = () => {
    api.put('/address/changedeliveryaddress', address)
      .then((response) => {
        setShippingAddress(response.data.data || address);
        handleClose();
      })
      .catch((error) => console.log(error));
  };

  const itemPrice = JSON.parse(localStorage.getItem('totalprize')) || 0;
  const itemCount = localStorage.getItem('itemcount') || 0;
  const deliveryCharge = 40;
  const grandTotal = itemPrice + deliveryCharge;

  return (
    <div className="page-container">
      <Header />

      <Container className="py-4">
        {/* Step Progress Bar */}
        <div className="d-flex justify-content-center align-items-center mb-5 gap-3">
          <div className="d-flex align-items-center gap-2">
            <span className="status-pill delivered">✓ 1. Shopping Bag</span>
          </div>
          <div style={{ height: "2px", width: "60px", background: "var(--app-primary)" }}></div>
          <div className="d-flex align-items-center gap-2">
            <span className="status-pill ordered">2. Order Summary</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="page-header pt-0">
          <h1 className="page-title">Order Summary & Payment</h1>
          <p className="page-subtitle">Confirm delivery address and select payment method</p>
        </div>

        <Row className="g-4">
          {/* Shipping Address Card */}
          <Col xs={12} lg={6}>
            <div className="glass-card h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                    📍 Delivery Information
                  </h3>
                  <Button className="btn-glass-secondary py-1 px-3" size="sm" onClick={handleShow}>
                    Change Address
                  </Button>
                </div>

                <div style={{ color: "#e2e8f0", fontSize: "0.95rem", lineHeight: 1.7 }}>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#ffffff", marginBottom: "0.5rem" }}>
                    Recipient: {shippinginfo.firstName ? `${shippinginfo.firstName} ${shippinginfo.lastName || ''}`.trim() : 'Customer'}
                  </div>
                  <div><strong>Address:</strong> {shippingaddress.address || 'Not provided'}</div>
                  <div><strong>Building No:</strong> {shippingaddress.BuildingNumber || 'N/A'}</div>
                  <div><strong>District & State:</strong> {shippingaddress.district ? `${shippingaddress.district}, ${shippingaddress.state}` : 'N/A'}</div>
                  <div><strong>Pincode:</strong> {shippingaddress.pincode || 'N/A'}</div>
                  <div><strong>Contact Phone:</strong> {shippinginfo.number || 'N/A'}</div>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", padding: "1rem", borderRadius: "12px", marginTop: "1.5rem" }}>
                <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>📅 Estimated Delivery Date:</span>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#10b981" }}>
                  {localStorage.getItem("expdeliverydate")}
                </div>
              </div>
            </div>
          </Col>

          {/* Payment Method & Price Details Card */}
          <Col xs={12} lg={6}>
            <div className="glass-card">
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#ffffff", marginBottom: "1.25rem" }}>
                💳 Payment Method
              </h3>

              <div className="d-flex flex-column gap-2 mb-4">
                {[
                  { id: "cod", label: "Cash On Delivery (COD)", icon: "💵" },
                  { id: "upi", label: "UPI (Google Pay / PhonePe / Paytm)", icon: "⚡" },
                  { id: "netbanking", label: "Net Banking", icon: "🏦" },
                  { id: "card", label: "Credit / Debit / ATM Card", icon: "💳" }
                ].map((method) => (
                  <label
                    key={method.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.85rem 1rem",
                      borderRadius: "12px",
                      background: selectedPayment === method.id ? "rgba(99, 102, 241, 0.2)" : "rgba(255, 255, 255, 0.04)",
                      border: selectedPayment === method.id ? "1px solid #6366f1" : "1px solid rgba(255, 255, 255, 0.08)",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span>{method.icon}</span>
                      <span style={{ fontWeight: 600, color: "#ffffff", fontSize: "0.95rem" }}>{method.label}</span>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={selectedPayment === method.id}
                      onChange={() => setSelectedPayment(method.id)}
                      style={{ accentColor: "#6366f1" }}
                    />
                  </label>
                ))}
              </div>

              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.85rem" }}>
                Bill Details
              </h4>
              <div className="d-flex justify-content-between mb-2" style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
                <span>Items ({itemCount})</span>
                <span>₹{itemPrice}</span>
              </div>
              <div className="d-flex justify-content-between mb-2" style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
                <span>Delivery & Handling Fee</span>
                <span>₹{deliveryCharge}</span>
              </div>
              <hr style={{ borderColor: "rgba(255,255,255,0.15)" }} />
              <div className="d-flex justify-content-between mb-4" style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff" }}>
                <span>Total Payable</span>
                <span style={{ color: "#a5b4fc" }}>₹{grandTotal}</span>
              </div>

              <Button className="btn-glass-primary w-100 py-3" onClick={conformOrder}>
                Confirm Order & Pay ₹{grandTotal}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Edit Address Modal */}
      <Modal show={show} onHide={handleClose} centered contentClassName="glass-modal">
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title style={{ color: "#ffffff", fontWeight: 700 }}>Update Delivery Address</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Row className="g-2 mb-3">
              <Col xs={6}>
                <Form.Group>
                  <Form.Label className="glass-label">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    className="glass-input"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    className="glass-input"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Street Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="House no, Street, Area"
                name="address"
                className="glass-input"
                onChange={handleChange}
              />
            </Form.Group>
            <Row className="g-2 mb-3">
              <Col xs={6}>
                <Form.Control
                  type="text"
                  placeholder="Building Number"
                  name="BuildingNumber"
                  className="glass-input"
                  onChange={handleChange}
                />
              </Col>
              <Col xs={6}>
                <Form.Control
                  type="text"
                  placeholder="District"
                  name="district"
                  className="glass-input"
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Row className="g-2 mb-3">
              <Col xs={6}>
                <Form.Control
                  type="text"
                  placeholder="State"
                  name="state"
                  className="glass-input"
                  onChange={handleChange}
                />
              </Col>
              <Col xs={6}>
                <Form.Control
                  type="text"
                  placeholder="Pincode"
                  name="pincode"
                  className="glass-input"
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Mobile number"
                name="number"
                className="glass-input"
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="btn-glass-primary" onClick={updateAdrress}>
            Update & Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderSummary;