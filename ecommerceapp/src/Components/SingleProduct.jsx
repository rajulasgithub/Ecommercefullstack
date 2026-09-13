import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Header from './Header';
import api from '../utils/api';
import ROLES from '../utils/roles';
import { isEmpty, isNumeric } from '../utils/validation';
import './Style.css';

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem('token');

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Edit modal states for company
  const [showEdit, setShowEdit] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/product/viewone/${id}`);
      if (response.data && response.data.data) {
        setProduct(response.data.data);
      } else {
        setError('Product not found.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    setSuccessMsg('');
    setError('');

    try {
      const response = await api.post('/cart/addtocart', { productId: id });
      if (response.data && response.data.success) {
        setSuccessMsg('✨ Item added to your shopping bag!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (window.confirm('Are you sure you want to delete this product listing?')) {
      try {
        await api.put(`/product/deleteproduct/${id}`);
        navigate('/viewproduct');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete product.');
      }
    }
  };

  const handleEditChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
    setEditErrors({ ...editErrors, [e.target.name]: '' });
  };

  const handleFileChange = (e) => {
    setUpdateData({ ...updateData, image: e.target.files[0] });
  };

  const validateEditForm = () => {
    const nameVal = updateData.prdName !== undefined ? updateData.prdName : product.prdName;
    const priceVal = updateData.prize !== undefined ? updateData.prize : product.prize;
    const sizeVal = updateData.size !== undefined ? updateData.size : product.size;
    const matVal = updateData.material !== undefined ? updateData.material : product.material;

    const errs = {};
    if (isEmpty(nameVal)) errs.prdName = "Product name is required";
    if (isEmpty(priceVal) || !isNumeric(priceVal)) errs.prize = "Price must be a valid number";
    if (isEmpty(sizeVal)) errs.size = "Product size is required";
    if (isEmpty(matVal)) errs.material = "Material is required";

    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveUpdate = async () => {
    if (!validateEditForm()) return;

    const formdata = new FormData();
    formdata.append('prdName', updateData.prdName || product.prdName);
    if (updateData.image) formdata.append('image', updateData.image);
    formdata.append('prize', updateData.prize || product.prize);
    formdata.append('size', updateData.size || product.size);
    formdata.append('material', updateData.material || product.material);

    try {
      await api.put(`/product/updateproduct/${id}`, formdata);
      setShowEdit(false);
      setEditErrors({});
      fetchProductDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product details.');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <Container className="py-5 text-center">
          <div className="glass-card py-5 style-loader" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="spinner-border text-indigo mb-3" role="status" style={{ width: '3rem', height: '3rem', color: '#a5b4fc' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4 style={{ color: '#ffffff', fontWeight: 600 }}>Loading Product Details...</h4>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container">
        <Header />
        <Container className="py-5 text-center">
          <div className="glass-card py-5" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ color: '#ffffff', fontWeight: 700 }}>{error || 'Product Not Found'}</h3>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>The product you are looking for may have been removed or is currently unavailable.</p>
            <Button className="btn-glass-primary" onClick={() => navigate('/viewproduct')}>
              Back to Catalog
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const images = Array.isArray(product.image) && product.image.length > 0
    ? product.image
    : ['/images/ethnic.jpg'];

  return (
    <div className="page-container">
      <Header />

      <Container className="py-4">
        {/* Navigation Breadcrumb & Back button */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <Button
            className="btn-glass-secondary py-1 px-3 d-flex align-items-center gap-2"
            onClick={() => navigate('/viewproduct')}
            style={{ fontSize: '0.9rem' }}
          >
            ← Back to Shop
          </Button>

          <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            <Link to="/" style={{ color: '#a5b4fc', textDecoration: 'none' }}>Home</Link> /{' '}
            <Link to="/viewproduct" style={{ color: '#a5b4fc', textDecoration: 'none' }}>Products</Link> /{' '}
            <span style={{ color: '#ffffff' }}>{product.prdName}</span>
          </div>
        </div>

        {/* Feedback Alerts */}
        {successMsg && (
          <div className="alert alert-success text-center mb-4 d-flex align-items-center justify-content-between px-4" role="alert" style={{ borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981', color: '#6ee7b7' }}>
            <span>{successMsg}</span>
            <Button className="btn-glass-primary py-1 px-3" size="sm" onClick={() => navigate('/cart')}>
              View Bag →
            </Button>
          </div>
        )}

        {/* Main Product Showcase Card */}
        <div className="glass-card p-4 p-md-5">
          <Row className="g-5 align-items-start">
            {/* Left Column: Image Gallery Showcase */}
            <Col xs={12} lg={6}>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                height: '420px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <img
                  src={images[selectedImage] || images[0]}
                  alt={product.prdName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                
                <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                  {product.status !== 6 ? (
                    <span className="status-pill delivered" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>In Stock</span>
                  ) : (
                    <span className="status-pill out-of-stock" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Thumbnails list if multiple images */}
              {images.length > 1 && (
                <div className="d-flex gap-2 mt-3 overflow-auto">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      onClick={() => setSelectedImage(idx)}
                      style={{
                        width: '70px',
                        height: '70px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        border: selectedImage === idx ? '2px solid #a5b4fc' : '1px solid rgba(255,255,255,0.1)',
                        opacity: selectedImage === idx ? 1 : 0.6,
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </div>
              )}
            </Col>

            {/* Right Column: Detailed Information & Actions */}
            <Col xs={12} lg={6}>
              <div className="d-flex flex-column justify-content-between h-100">
                <div>
                  <span className="status-pill ordered mb-2" style={{ display: 'inline-block' }}>Premium Fashion</span>
                  
                  <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
                    {product.prdName}
                  </h1>

                  {/* Pricing Display */}
                  <div className="d-flex align-items-baseline gap-3 mb-4">
                    <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#a5b4fc' }}>
                      ₹{product.prize}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                      ₹{Math.round(product.prize * 1.25)}
                    </span>
                    <span className="status-pill delivered" style={{ fontSize: '0.75rem' }}>
                      20% OFF
                    </span>
                  </div>

                  <hr style={{ borderColor: 'rgba(255,255,255,0.15)', margin: '1.5rem 0' }} />

                  {/* Attributes Grid */}
                  <div className="d-flex flex-column gap-3 mb-4">
                    <div className="d-flex align-items-center">
                      <span style={{ width: '130px', color: '#9ca3af', fontWeight: 500 }}>Available Size:</span>
                      <span style={{
                        background: 'rgba(99, 102, 241, 0.2)',
                        border: '1px solid rgba(99, 102, 241, 0.4)',
                        color: '#ffffff',
                        padding: '0.35rem 0.9rem',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.95rem'
                      }}>
                        {product.size}
                      </span>
                    </div>

                    <div className="d-flex align-items-center">
                      <span style={{ width: '130px', color: '#9ca3af', fontWeight: 500 }}>Material & Fabric:</span>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>
                        {product.material}
                      </span>
                    </div>

                    <div className="d-flex align-items-center">
                      <span style={{ width: '130px', color: '#9ca3af', fontWeight: 500 }}>Delivery Info:</span>
                      <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.95rem' }}>
                        🚚 Free Delivery in 3-5 Business Days
                      </span>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    marginBottom: '2rem'
                  }}>
                    <h5 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Product Highlights & Care Instructions
                    </h5>
                    <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>
                      Handcrafted with premium {product.material} fabric tailored for elegant fit and lasting durability. Dry clean or gentle hand wash recommended for fabric longevity.
                    </p>
                  </div>
                </div>

                {/* Role Specific Action Buttons */}
                <div>
                  {role === ROLES.COMPANY || role === ROLES.ADMIN ? (
                    <div className="d-flex gap-3">
                      <Button
                        className="btn-glass-secondary w-50 py-3"
                        onClick={() => setShowEdit(true)}
                      >
                        ✏️ Edit Product
                      </Button>
                      <Button
                        className="btn-glass-danger w-50 py-3"
                        onClick={handleDeleteProduct}
                      >
                        🗑️ Delete Product
                      </Button>
                    </div>
                  ) : (
                    <div className="d-grid gap-2">
                      {product.status !== 6 ? (
                        <Button
                          className="btn-glass-primary py-3"
                          style={{ fontSize: '1.1rem', fontWeight: 700 }}
                          disabled={addingToCart}
                          onClick={handleAddToCart}
                        >
                          {addingToCart ? 'Adding to Bag...' : '🛍️ Add to Shopping Bag'}
                        </Button>
                      ) : (
                        <Button className="btn-glass-secondary py-3" disabled style={{ opacity: 0.6 }}>
                          Currently Out of Stock
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      {/* Edit Product Modal for Vendors */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered contentClassName="glass-modal">
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title style={{ color: '#ffffff', fontWeight: 700 }}>Edit Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Product Name</Form.Label>
              <Form.Control
                type="text"
                name="prdName"
                defaultValue={product.prdName}
                className="glass-input"
                onChange={handleEditChange}
              />
              {editErrors.prdName && <span className="glass-error-badge">{editErrors.prdName}</span>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Product Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                className="glass-input"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Price (₹)</Form.Label>
              <Form.Control
                type="number"
                name="prize"
                defaultValue={product.prize}
                className="glass-input"
                onChange={handleEditChange}
              />
              {editErrors.prize && <span className="glass-error-badge">{editErrors.prize}</span>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Size</Form.Label>
              <Form.Control
                type="text"
                name="size"
                defaultValue={product.size}
                className="glass-input"
                onChange={handleEditChange}
              />
              {editErrors.size && <span className="glass-error-badge">{editErrors.size}</span>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Material</Form.Label>
              <Form.Control
                type="text"
                name="material"
                defaultValue={product.material}
                className="glass-input"
                onChange={handleEditChange}
              />
              {editErrors.material && <span className="glass-error-badge">{editErrors.material}</span>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-secondary" onClick={() => setShowEdit(false)}>
            Cancel
          </Button>
          <Button className="btn-glass-primary" onClick={handleSaveUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SingleProduct;
