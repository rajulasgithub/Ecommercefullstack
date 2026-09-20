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
import SEO from "./SEO";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import ROLES from "../utils/roles";
import { isEmpty } from "../utils/validation";

const Vieworders = ({ hideHeader = false }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [order, setOrder] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

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

    let url = `/order/vieworderuser?page=${page}&limit=10`;
    if (role === ROLES.ADMIN) {
      url = `/order/viewcartcmpny?page=${page}&limit=10&search=${debouncedSearch}`;
    } else if (role === ROLES.COMPANY || role === 'seller') {
      url = `/order/viewsellerorders?page=${page}&limit=10&search=${debouncedSearch}`;
    }

    api.get(url)
      .then((response) => {
        setOrder(response.data.data || []);
        setTotalPages(Math.ceil((response.data.totalCount || 0) / 10));
      })
      .catch((error) => console.log(error));
  }, [role, page, debouncedSearch]);

  const cancelOrder = (id) => {
    api.put(`/order/cancelorder/${id}`)
      .then(() => {
        toast.success("Order cancelled successfully");
        setOrder(order.map(item => item._id === id ? { ...item, status: 3 } : item));
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
        setOrder(order.map(item => item._id === id ? { ...item, status: parseInt(value) } : item));
      })
      .catch((error) => {
        toast.error("Failed to update order status.");
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
        <div className="page-header d-flex justify-content-between align-items-end flex-wrap gap-3">
          <div>
            <span className="status-pill ordered mb-2">Order Management</span>
            <h1 className="page-title">
              {role === ROLES.ADMIN
                ? "Admin Orders Dashboard"
                : (role === ROLES.COMPANY || role === 'seller')
                  ? "Seller Orders Dashboard"
                  : "My Order History"}
            </h1>
            <p className="page-subtitle">{order.length} order(s) record found on this page</p>
          </div>
        </div>
      )}

      {/* Search Bar for Admin and Seller (Always visible if applicable) */}
      {(role === ROLES.ADMIN || role === ROLES.COMPANY || role === 'seller') && (
        <div className="mb-4 d-flex justify-content-end">
          <div style={{ maxWidth: "300px", width: "100%" }}>
            <Form.Control
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input"
            />
          </div>
        </div>
      )}

      {order.length === 0 ? (
        <div className="glass-card text-center py-5" style={{ maxWidth: "550px", margin: "0 auto" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
          <h3 className="page-title" style={{ fontSize: "1.5rem" }}>No Orders Found</h3>
          <p className="page-subtitle mb-4">No order records are available for this page.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {order.map((item, index) => (
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
                    <span>Quantity: <strong style={{ color: "#ffffff" }}>{item.quantity || 1}</strong></span>
                    <span>Total: <strong style={{ color: "#10b981" }}>₹{(item.quantity || 1) * (item.prdId?.prize || item.prize || 0)}</strong></span>
                    {item.size && <span>Size: <strong style={{ color: "#ffffff" }}>{item.size}</strong></span>}
                  </div>

                  {/* Customer Details for Sellers & Admins */}
                  {(role === ROLES.ADMIN || role === ROLES.COMPANY || role === 'seller') && item.firstName && (
                    <div className="mt-2 p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ color: '#fff', marginBottom: '4px' }}><strong>👤 Customer Details</strong></div>
                      <div>Name: <span style={{ color: '#fff' }}>{item.firstName} {item.lastName}</span></div>
                      <div>Phone: <span style={{ color: '#fff' }}>{item.number}</span></div>
                      <div>Address: <span style={{ color: '#fff' }}>{item.BuildingNumber}, {item.address}, {item.district}, {item.state} - {item.pincode}</span></div>
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
                    </div>
                  ) : (
                    <div className="d-flex flex-column align-items-sm-end gap-2">
                      {(item.prdId?._id || item.prdId) && (
                        <Button
                          className="btn-glass-primary py-1 px-3"
                          size="sm"
                          onClick={() => navigate(`/viewone/${item.prdId?._id || item.prdId}`)}
                        >
                          ⭐ {item.status === 7 ? "Review Product" : "View Product"}
                        </Button>
                      )}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button
            className="btn-glass-secondary"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </Button>
          <div className="d-flex align-items-center" style={{ color: '#fff', fontWeight: 600 }}>
            Page {page} of {totalPages}
          </div>
          <Button
            className="btn-glass-secondary"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </Container>
  );

  if (hideHeader) {
    return ordersContent;
  }

  return (
    <div className="page-container">
      <SEO title="My Orders" noindex={true} />
      <Header />
      {ordersContent}
    </div>
  );
};

export default Vieworders;
