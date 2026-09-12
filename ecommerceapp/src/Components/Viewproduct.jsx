import React, { useState, useEffect } from 'react';
import './Style.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Modal from 'react-bootstrap/Modal';
import Form from "react-bootstrap/Form";
import api from '../utils/api';
import ROLES from '../utils/roles';

const Viewproduct = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [product, setProduct] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [updateprdt, setUpdateprdt] = useState({});
  const [activeItemId, setActiveItemId] = useState(null);
  const [show, setShow] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    api.get('/product/viewproduct')
      .then((response) => {
        setProduct(response.data.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (id) => {
    if (!token) {
      navigate('/login');
      return;
    }

    const prdId = { productId: id };
    api.post('/cart/addtocart', prdId)
      .then((response) => {
        navigate('/cart');
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Failed to add to cart.";
        setErrorMsg(msg);
      });
  };

  const dltproduct = (id) => {
    api.put(`/product/deleteproduct/${id}`)
      .then((response) => {
        setProduct(product.filter(p => p._id !== id));
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Failed to delete product.";
        setErrorMsg(msg);
      });
  };

  const handleChange = (event) => {
    setUpdateprdt({ ...updateprdt, [event.target.name]: event.target.value });
  };

  const fileChange = (event) => {
    setUpdateprdt({ ...updateprdt, image: event.target.files[0] });
  };

  const handleUpdate = (id) => {
    const formdata = new FormData();
    formdata.append('prdName', updateprdt.prdName || '');
    if (updateprdt.image) formdata.append('image', updateprdt.image);
    formdata.append('prize', updateprdt.prize || '');
    formdata.append('size', updateprdt.size || '');
    formdata.append('material', updateprdt.material || '');

    api.put(`/product/updateproduct/${id}`, formdata)
      .then((response) => {
        handleClose();
        // Refresh product list
        api.get('/product/viewproduct').then((res) => setProduct(res.data.data || []));
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Failed to update product.";
        setErrorMsg(msg);
      });
  };

  const handleClose = () => {
    setShow(false);
    setActiveItemId(null);
  };

  const handleShow = (id) => {
    setActiveItemId(id);
    setShow(true);
  };

  const setStatus = (id, value) => {
    api.put(`/product/updateproductstatus/${id}/${value}`)
      .then((response) => {
        api.get('/product/viewproduct').then((res) => setProduct(res.data.data || []));
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Failed to update status.";
        setErrorMsg(msg);
      });
  };

  const filteredProducts = product.filter((item) =>
    item.prdName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.material?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <Header />

      <Container className="py-4">
        {/* Page Header */}
        <div className="page-header">
          <span className="status-pill ordered mb-2">Curated Fashion</span>
          <h1 className="page-title">Explore Our Apparel Collection</h1>
          <p className="page-subtitle">Discover handcrafted dresses, ethnic wear, and modern outfits</p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger text-center mb-4" role="alert" style={{ fontSize: "0.875rem" }}>
            {errorMsg}
          </div>
        )}

        {/* Search & Filter Bar */}
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={6}>
            <Form.Control
              type="text"
              placeholder="🔍 Search dresses, fabric, material..."
              className="glass-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
        </Row>

        {/* Products Grid */}
        <Row className="g-4">
          {filteredProducts.map((item) => (
            <Col key={item._id} xs={12} sm={6} md={4} lg={3}>
              <div className="glass-card h-100 d-flex flex-column justify-content-between p-3">
                <div>
                  {/* Product Image */}
                  <div
                    onClick={() => navigate(`/product/${item._id}`)}
                    style={{
                      borderRadius: "14px",
                      overflow: "hidden",
                      height: "220px",
                      position: "relative",
                      marginBottom: "1rem",
                      backgroundColor: "rgba(0,0,0,0.3)",
                      cursor: "pointer"
                    }}
                  >
                    <img
                      src={item.image ? item.image[0] : '/images/ethnic.jpg'}
                      alt={item.prdName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                      onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                    <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                      {item.status !== 6 ? (
                        <span className="status-pill delivered">In Stock</span>
                      ) : (
                        <span className="status-pill out-of-stock">Out of Stock</span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <h3
                    onClick={() => navigate(`/product/${item._id}`)}
                    style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.4rem", cursor: "pointer" }}
                    onMouseOver={(e) => e.currentTarget.style.color = "#a5b4fc"}
                    onMouseOut={(e) => e.currentTarget.style.color = "#ffffff"}
                  >
                    {item.prdName}
                  </h3>

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#a5b4fc" }}>
                      ₹{item.prize}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#9ca3af", background: "rgba(255,255,255,0.08)", padding: "0.2rem 0.6rem", borderRadius: "6px" }}>
                      Size: {item.size}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: "1rem" }}>
                    Material: {item.material}
                  </p>
                </div>

                {/* Actions depending on Role */}
                <div>
                  {role === ROLES.COMPANY || role === ROLES.ADMIN ? (
                    /* Company Seller Actions */
                    <div className="d-flex flex-column gap-2">
                      {item.status !== 6 ? (
                        <div className="d-flex gap-2">
                          <Button className="btn-glass-secondary w-50 py-1" size="sm" onClick={() => handleShow(item._id)}>
                            Edit
                          </Button>
                          <Button className="btn-glass-danger w-50 py-1" size="sm" onClick={() => dltproduct(item._id)}>
                            Delete
                          </Button>
                        </div>
                      ) : (
                        <Form.Select
                          className="glass-input text-sm py-1"
                          style={{ fontSize: "0.85rem" }}
                          name="status"
                          onChange={(e) => setStatus(item._id, e.target.value)}
                        >
                          <option value="" style={{ color: "#000" }}>-- Select Action --</option>
                          <option value="0" style={{ color: "#000" }}>Restock Product</option>
                        </Form.Select>
                      )}
                    </div>
                  ) : (
                    /* Customer Actions */
                    <div className="d-flex gap-2">
                      <Button className="btn-glass-secondary w-50" size="sm" onClick={() => navigate(`/product/${item._id}`)}>
                        Details
                      </Button>
                      {item.status !== 6 ? (
                        <Button className="btn-glass-primary w-50" size="sm" onClick={() => handleSubmit(item._id)}>
                          Add to Cart
                        </Button>
                      ) : (
                        <Button className="btn-glass-secondary w-50" disabled style={{ opacity: 0.6 }} size="sm">
                          Unavailable
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Edit Product Modal */}
      <Modal show={show} onHide={handleClose} centered contentClassName="glass-modal">
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title style={{ color: "#ffffff", fontWeight: 700 }}>Update Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Product Name"
                name="prdName"
                className="glass-input"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Product Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                className="glass-input"
                onChange={fileChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Price (₹)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Price"
                name="prize"
                className="glass-input"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Size</Form.Label>
              <Form.Control
                type="text"
                placeholder="Size"
                name="size"
                className="glass-input"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Material</Form.Label>
              <Form.Control
                type="text"
                placeholder="Material"
                name="material"
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
          <Button className="btn-glass-primary" onClick={() => handleUpdate(activeItemId)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Viewproduct;