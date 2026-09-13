import React, { useEffect, useState } from "react";
import "./Style.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import Header from "./Header";
import api from "../utils/api";
import ROLES from "../utils/roles";
import { isEmpty } from "../utils/validation";

const Vieworders = ({ hideHeader = false }) => {
  const role = localStorage.getItem("role");
  const [order, setOrder] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [show, setShow] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [getid, setGetId] = useState("");

  useEffect(() => {
    const ordertime = localStorage.getItem("orderedtime");
    if (ordertime) {
      const now = Date.now();
      const hoursPassed = (now - ordertime);
      if (hoursPassed > 86400000) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }

    if (role === ROLES.COMPANY || role === ROLES.ADMIN) {
      api.get("/order/viewcartcmpny")
        .then((response) => {
          setOrder(response.data.data || []);
        })
        .catch((error) => console.log(error));
    } else {
      api.get("/order/vieworderuser")
        .then((response) => {
          setOrder(response.data.data || []);
        })
        .catch((error) => console.log(error));
    }
  }, [role]);

  useEffect(() => {
    const filtered = order.filter(
      (item) =>
        item.status === 2 ||
        item.status === 3 ||
        item.status === 4 ||
        item.status === 5 ||
        item.status === 6 ||
        item.status === 7
    );
    setFilteredData(filtered);
  }, [order]);

  const cancelOrder = (id) => {
    api.put(`/order/cancelorder/${id}`)
      .then(() => {
        toast.success("Order cancelled successfully");
        setFilteredData(filteredData.map(item => item._id === id ? { ...item, status: 3 } : item));
      })
      .catch((error) => {
        toast.error("Failed to cancel order.");
        console.log(error);
      });
  };

  const statusChange = (id, value) => {
    api.put(`/order/updatecartstatus/${id}/${value}`)
      .then(() => {
        toast.success("Order status updated successfully!");
        setFilteredData(filteredData.map(item => item._id === id ? { ...item, status: parseInt(value) } : item));
      })
      .catch((error) => {
        toast.error("Failed to update order status.");
        console.log(error);
      });
  };

  const handleShow = (id) => {
    setShow(true);
    setGetId(id);
    setDeliveryDate("");
    setDateError("");
  };
  const handleClose = () => {
    setShow(false);
    setDateError("");
  };

  const dateChange = () => {
    if (isEmpty(deliveryDate)) {
      setDateError("Delivery date is required");
      return;
    }

    api.put(`/order/updatedeliverydate/${getid}`, { date: deliveryDate })
      .then(() => {
        toast.success("Delivery date updated successfully!");
        setFilteredData(filteredData.map(item => item._id === getid ? { ...item, deliveryDate: deliveryDate } : item));
        handleClose();
      })
      .catch((error) => {
        toast.error("Failed to update delivery date.");
        console.log(error);
      });
  };

  const renderStatusBadge = (statusNum) => {
    switch (statusNum) {
      case 2: return <span className="status-pill ordered">Ordered</span>;
      case 3: return <span className="status-pill cancelled">Order Cancelled</span>;
      case 4: return <span className="status-pill processing">Processing</span>;
      case 5: return <span className="status-pill out-for-delivery">Out for Delivery</span>;
      case 6: return <span className="status-pill out-of-stock">Out of Stock</span>;
      case 7: return <span className="status-pill delivered">Delivered</span>;
      default: return <span className="status-pill ordered">Ordered</span>;
    }
  };

  const ordersContent = (
    <Container className={hideHeader ? "py-2" : "py-4"}>
      {/* Page Header */}
      {!hideHeader && (
        <div className="page-header">
          <span className="status-pill ordered mb-2">Order Management</span>
          <h1 className="page-title">{role === ROLES.COMPANY || role === ROLES.ADMIN ? "Company Orders Dashboard" : "My Order History"}</h1>
          <p className="page-subtitle">{filteredData.length} order(s) record found</p>
        </div>
      )}

      {filteredData.length === 0 ? (
        <div className="glass-card text-center py-5" style={{ maxWidth: "550px", margin: "0 auto" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
          <h3 className="page-title" style={{ fontSize: "1.5rem" }}>No Orders Placed Yet</h3>
          <p className="page-subtitle mb-4">Explore our catalog and place your first order today!</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {filteredData.map((item, index) => (
            <div key={item._id || index} className="glass-card p-4">
              <Row className="align-items-center g-3">
                {/* Item Image */}
                <Col xs={12} sm={3} md={2}>
                  <img
                    src={
                      item.prdId?.image
                        ? item.prdId.image[0]
                        : item.image
                        ? item.image[0]
                        : '/images/ethnic.jpg'
                    }
                    alt={item.prdId?.prdName || item.prdName}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "14px"
                    }}
                  />
                </Col>

                {/* Item Details */}
                <Col xs={12} sm={5} md={6}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                      {item.prdId?.prdName || item.prdName}
                    </h3>
                    {renderStatusBadge(item.status)}
                  </div>

                  <div className="d-flex gap-3 mb-2 flex-wrap" style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                    <span>Quantity: <strong style={{ color: "#ffffff" }}>{item.count || 1}</strong></span>
                    <span>Total: <strong style={{ color: "#10b981" }}>₹{item.totalPrize || item.prize}</strong></span>
                    {item.size && <span>Size: <strong style={{ color: "#ffffff" }}>{item.size}</strong></span>}
                  </div>

                  {item.deliveryDate && (
                    <div style={{ fontSize: "0.8rem", color: "#a5b4fc" }}>
                      Expected Delivery: <strong>{new Date(item.deliveryDate).toLocaleDateString()}</strong>
                    </div>
                  )}
                </Col>

                {/* Seller / Admin Status Management Controls */}
                <Col xs={12} sm={4} md={4} className="text-sm-end">
                  {role === ROLES.COMPANY || role === ROLES.ADMIN ? (
                    <div className="d-flex flex-column align-items-sm-end gap-2">
                      <Form.Select
                        className="glass-input py-1"
                        style={{ fontSize: "0.85rem", maxWidth: "200px" }}
                        value={item.status}
                        onChange={(e) => statusChange(item._id, e.target.value)}
                      >
                        <option value={2} style={{ color: "#000" }}>Ordered</option>
                        <option value={4} style={{ color: "#000" }}>Processing</option>
                        <option value={5} style={{ color: "#000" }}>Out for Delivery</option>
                        <option value={6} style={{ color: "#000" }}>Out of Stock</option>
                        <option value={7} style={{ color: "#000" }}>Delivered</option>
                        <option value={3} style={{ color: "#000" }}>Cancel Order</option>
                      </Form.Select>

                      <Button
                        className="btn-glass-secondary py-1 px-3"
                        size="sm"
                        style={{ fontSize: "0.8rem" }}
                        onClick={() => handleShow(item._id)}
                      >
                        📅 Set Delivery Date
                      </Button>
                    </div>
                  ) : (
                    <div>
                      {item.status !== 3 && item.status !== 7 && (
                        <Button
                          className="btn-glass-danger py-1 px-3"
                          size="sm"
                          disabled={isDisabled}
                          onClick={() => cancelOrder(item._id)}
                        >
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  )}
                </Col>
              </Row>
            </div>
          ))}
        </div>
      )}

      {/* Date Change Modal */}
      <Modal show={show} onHide={handleClose} centered contentClassName="glass-modal">
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title style={{ color: "#ffffff", fontWeight: 700 }}>Reschedule Delivery Date</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form.Group>
            <Form.Label className="glass-label">Select Preferred Delivery Date</Form.Label>
            <Form.Control
              type="date"
              name="deliveryDate"
              className="glass-input"
              value={deliveryDate}
              onChange={(e) => {
                setDeliveryDate(e.target.value);
                setDateError("");
              }}
            />
            {dateError && <span className="glass-error-badge">{dateError}</span>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="btn-glass-primary" onClick={dateChange}>
            Save New Date
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );

  if (hideHeader) {
    return ordersContent;
  }

  return (
    <div className="page-container">
      <Header />
      {ordersContent}
    </div>
  );
};

export default Vieworders;
