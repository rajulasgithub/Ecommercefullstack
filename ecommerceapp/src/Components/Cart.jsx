import React, { useEffect, useState } from "react";
import "./Style.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Header from "./Header";
import api from "../utils/api";

const Cart = () => {
  const navigate = useNavigate();
  const [cartitem, setCartitem] = useState([]);
  const [address, setAddress] = useState({});
  const [newaddress, setNewaddress] = useState({});
  const [totalValue, setTotalValue] = useState(0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const confirmRemoveItem = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleRemoveConfirm = () => {
    if (itemToDelete) {
      removeItem(itemToDelete);
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleRemoveCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  useEffect(() => {
    api.get("/cart/viewcart")
      .then((response) => {
        setCartitem(response.data.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const decrement = (id) => {
    api.put(`/cart/decrcart/${id}`)
      .then(() => {
        const updated = cartitem.map((data) => {
          if (data._id === id && data.quantity > 1) {
            return { ...data, quantity: data.quantity - 1 };
          }
          return data;
        });
        setCartitem(updated);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const increment = (id) => {
    api.put(`/cart/incrcart/${id}`)
      .then(() => {
        const updated = cartitem.map((data) => {
          if (data._id === id) {
            return { ...data, quantity: data.quantity + 1 };
          }
          return data;
        });
        setCartitem(updated);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    let val = 0;
    cartitem?.forEach((item) => {
      if (item.prdId) {
        val += item.prdId.prize * item.quantity;
      }
    });
    setTotalValue(val);
  }, [cartitem]);

  const handlehange = (event) => {
    setAddress({ ...address, [event.target.name]: event.target.value });
  };

  const handleAdd = (event) => {
    setNewaddress({ ...newaddress, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    api.post("/address/addAddress", newaddress)
      .then((response) => {
        toast.success("Shipping address saved!");
        setAddress(response.data.data || {});
      })
      .catch((error) => {
        toast.error("Failed to save address.");
        console.log(error);
      });
  };

  useEffect(() => {
    api.get("/address/getaddress")
      .then((response) => {
        setAddress(response.data.data || {});
      })
      .catch((error) => console.log(error));
  }, []);

  const handleUpdate = (event) => {
    if (event) event.preventDefault();
    api.put("/address/updateaddress", address)
      .then((response) => {
        toast.success("Shipping address updated!");
      })
      .catch((error) => {
        toast.error("Failed to update address.");
        console.log(error);
      });
  };

  const removeItem = (id) => {
    api.delete(`/cart/delcartitem/${id}`)
      .then(() => {
        toast.success("Item removed from shopping bag");
        setCartitem(cartitem.filter((data) => data._id !== id));
      })
      .catch((error) => {
        // Fallback for GET method
        api.get(`/cart/delcartitem/${id}`)
          .then(() => {
            toast.success("Item removed from shopping bag");
            setCartitem(cartitem.filter((data) => data._id !== id));
          })
          .catch((err) => {
            toast.error("Failed to remove item.");
            console.log(err);
          });
      });
  };

  const checkOut = () => {
    navigate("/ordersummary");
    localStorage.setItem("totalprize", totalValue);
    localStorage.setItem("itemcount", cartitem.length);
  };

  return (
    <div className="page-container">
      <Header />

      <Container className="py-4">
        {/* Step Progress Bar */}
        <div className="d-flex justify-content-center align-items-center mb-5 gap-3">
          <div className="d-flex align-items-center gap-2">
            <span className="status-pill ordered">1. Shopping Bag</span>
          </div>
          <div style={{ height: "2px", width: "60px", background: "rgba(255,255,255,0.2)" }}></div>
          <div className="d-flex align-items-center gap-2">
            <span className="status-pill out-of-stock">2. Order Summary</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="page-header pt-0">
          <h1 className="page-title">Your Shopping Bag</h1>
          <p className="page-subtitle">{cartitem.length} item(s) selected in your bag</p>
        </div>

        {cartitem.length === 0 ? (
          <div className="glass-card text-center py-5" style={{ maxWidth: "550px", margin: "0 auto" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛍️</div>
            <h3 className="page-title" style={{ fontSize: "1.5rem" }}>Your Bag is Empty</h3>
            <p className="page-subtitle mb-4">Discover our handpicked collection and find your perfect dress today.</p>
            <Button className="btn-glass-primary" onClick={() => navigate('/viewproduct')}>
              Explore Shop
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {/* Cart Items List */}
            <Col xs={12} lg={8}>
              <div className="d-flex flex-column gap-3">
                {cartitem.map((item) => (
                  <div key={item._id} className="glass-card p-3">
                    <Row className="align-items-center g-3">
                      <Col xs={4} sm={3} md={2}>
                        <img
                          src={item.prdId?.image ? item.prdId.image[0] : '/images/ethnic.jpg'}
                          alt={item.prdId?.prdName}
                          style={{
                            width: "100%",
                            height: "90px",
                            objectFit: "cover",
                            borderRadius: "12px"
                          }}
                        />
                      </Col>

                      <Col xs={8} sm={5} md={5}>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.25rem" }}>
                          {item.prdId?.prdName}
                        </h4>
                        <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                          Size: <span style={{ color: "#ffffff" }}>{item.prdId?.size}</span>
                        </div>
                        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#a5b4fc", marginTop: "0.25rem" }}>
                          ₹{item.prdId?.prize}
                        </div>
                      </Col>

                      <Col xs={6} sm={4} md={3} className="d-flex align-items-center justify-content-sm-center">
                        <div className="quantity-control">
                          <button className="quantity-btn" onClick={() => decrement(item._id)}>-</button>
                          <span className="quantity-val">{item.quantity}</span>
                          <button className="quantity-btn" onClick={() => increment(item._id)}>+</button>
                        </div>
                      </Col>

                      <Col xs={6} sm={12} md={2} className="text-end">
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>
                          ₹{item.prdId?.prize * item.quantity}
                        </div>
                        <Button className="btn-glass-danger py-1 px-2" size="sm" onClick={() => confirmRemoveItem(item._id)}>
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            </Col>

            {/* Shipping Address & Total Order Summary Widget */}
            <Col xs={12} lg={4}>
              <div className="glass-card mb-4">
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff", marginBottom: "1rem" }}>
                  📍 Shipping Address
                </h3>

                {address?.address || address?.state || address?.district ? (
                  <Form onSubmit={handleUpdate}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        as="textarea"
                        rows={2}
                        className="glass-input"
                        name="address"
                        value={address?.address || ''}
                        placeholder="Street Address"
                        onChange={handlehange}
                      />
                    </Form.Group>
                    <Row className="g-2 mb-2">
                      <Col xs={6}>
                        <Form.Control
                          type="text"
                          className="glass-input"
                          name="state"
                          value={address?.state || ''}
                          placeholder="State"
                          onChange={handlehange}
                        />
                      </Col>
                      <Col xs={6}>
                        <Form.Control
                          type="text"
                          className="glass-input"
                          name="district"
                          value={address?.district || ''}
                          placeholder="District"
                          onChange={handlehange}
                        />
                      </Col>
                    </Row>
                    <Row className="g-2 mb-3">
                      <Col xs={6}>
                        <Form.Control
                          type="text"
                          className="glass-input"
                          name="pincode"
                          value={address?.pincode || ''}
                          placeholder="Pincode"
                          onChange={handlehange}
                        />
                      </Col>
                      <Col xs={6}>
                        <Form.Control
                          type="text"
                          className="glass-input"
                          name="BuildingNumber"
                          value={address?.BuildingNumber || ''}
                          placeholder="Building No."
                          onChange={handlehange}
                        />
                      </Col>
                    </Row>
                    <Button type="submit" className="btn-glass-secondary w-100 py-1" size="sm">
                      Update Address
                    </Button>
                  </Form>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        as="textarea"
                        rows={2}
                        className="glass-input"
                        name="address"
                        placeholder="Enter Street Address"
                        onChange={handleAdd}
                      />
                    </Form.Group>
                    <Row className="g-2 mb-2">
                      <Col xs={6}>
                        <Form.Control
                          type="text"
                          className="glass-input"
                          name="state"
                          placeholder="State"
                          onChange={handleAdd}
                        />
                      </Col>
                      <Col xs={6}>
                        <Form.Control
                          type="text"
                          className="glass-input"
                          name="district"
                          placeholder="District"
                          onChange={handleAdd}
                        />
                      </Col>
                    </Row>
                    <Row className="g-2 mb-3">
                      <Col xs={6}>
                        <Form.Control
                          type="text"
                          className="glass-input"
                          name="pincode"
                          placeholder="Pincode"
                          onChange={handleAdd}
                        />
                      </Col>
                      <Col xs={6}>
                        <Form.Control
                          type="text"
                          className="glass-input"
                          name="BuildingNumber"
                          placeholder="Building No."
                          onChange={handleAdd}
                        />
                      </Col>
                    </Row>
                    <Button type="submit" className="btn-glass-secondary w-100 py-1" size="sm">
                      Save Address
                    </Button>
                  </Form>
                )}
              </div>

              {/* Order Total Widget */}
              <div className="glass-card" style={{ background: "rgba(99, 102, 241, 0.1)", borderColor: "rgba(99, 102, 241, 0.3)" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff", marginBottom: "1rem" }}>
                  Order Total
                </h3>

                <div className="d-flex justify-content-between mb-2" style={{ color: "#cbd5e1" }}>
                  <span>Bag Subtotal</span>
                  <span>₹{totalValue}</span>
                </div>
                <div className="d-flex justify-content-between mb-2" style={{ color: "#cbd5e1" }}>
                  <span>Estimated Shipping</span>
                  <span style={{ color: "#10b981", fontWeight: 600 }}>FREE</span>
                </div>
                <hr style={{ borderColor: "rgba(255,255,255,0.15)" }} />
                <div className="d-flex justify-content-between mb-4" style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff" }}>
                  <span>Total Amount</span>
                  <span style={{ color: "#a5b4fc" }}>₹{totalValue}</span>
                </div>

                <Button className="btn-glass-primary w-100 py-2" onClick={checkOut}>
                  Proceed to Checkout →
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </Container>

      {/* Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleRemoveCancel} centered contentClassName="glass-modal">
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title style={{ color: "#ffffff", fontWeight: 700 }}>Remove Item</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4" style={{ color: "#cbd5e1" }}>
          Are you sure you want to remove this item from your shopping bag?
        </Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-secondary" onClick={handleRemoveCancel}>
            Cancel
          </Button>
          <Button className="btn-glass-danger" onClick={handleRemoveConfirm}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cart;
