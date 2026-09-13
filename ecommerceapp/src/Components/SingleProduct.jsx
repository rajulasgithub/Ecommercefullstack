import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
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
  const [savingEdit, setSavingEdit] = useState(false);

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

  const handleEditSizeToggle = (sz) => {
    const current = updateData.selectedSizes !== undefined
      ? updateData.selectedSizes
      : (product?.size ? product.size.split(',').map(s => s.trim()).filter(Boolean) : []);
    const updated = current.includes(sz) ? current.filter(s => s !== sz) : [...current, sz];
    setUpdateData({
      ...updateData,
      selectedSizes: updated,
      size: updated.join(', ')
    });
    setEditErrors({ ...editErrors, size: '' });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUpdateData({ ...updateData, imageFiles: files, image: files[0] });
  };

  const validateEditForm = () => {
    const nameVal = updateData.prdName !== undefined ? updateData.prdName : product.prdName;
    const catVal = updateData.category !== undefined ? updateData.category : product.category;
    const styleVal = updateData.style !== undefined ? updateData.style : product.style;
    const descVal = updateData.description !== undefined ? updateData.description : product.description;
    const priceVal = updateData.prize !== undefined ? updateData.prize : product.prize;
    const stockVal = updateData.stock !== undefined ? updateData.stock : product.stock;
    const sizeVal = updateData.size !== undefined ? updateData.size : product.size;
    const matVal = updateData.material !== undefined ? updateData.material : product.material;

    const errs = {};
    if (isEmpty(nameVal)) errs.prdName = "Product name is required";
    if (isEmpty(catVal)) errs.category = "Category is required";
    if (isEmpty(styleVal)) errs.style = "Style is required";
    if (isEmpty(descVal)) {
      errs.description = "Description is required";
    } else if (descVal.trim().length < 10 || descVal.trim().length > 1000) {
      errs.description = "Description must be between 10 and 1000 characters";
    }
    if (isEmpty(priceVal) || !isNumeric(priceVal) || Number(priceVal) <= 0) {
      errs.prize = "Price must be a positive number greater than 0";
    }
    if (isEmpty(stockVal)) errs.stock = "Stock status is required";
    if (isEmpty(sizeVal)) errs.size = "At least one size must be selected";
    if (isEmpty(matVal)) errs.material = "Material is required";

    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveUpdate = async () => {
    if (!validateEditForm()) return;

    setSavingEdit(true);
    const formdata = new FormData();
    formdata.append('prdName', updateData.prdName !== undefined ? updateData.prdName : product.prdName);
    formdata.append('category', updateData.category !== undefined ? updateData.category : (product.category || 'Women'));
    formdata.append('style', updateData.style !== undefined ? updateData.style : (product.style || 'Casual Wear'));
    formdata.append('description', updateData.description !== undefined ? updateData.description : (product.description || ''));

    if (updateData.imageFiles && updateData.imageFiles.length > 0) {
      updateData.imageFiles.forEach((file) => formdata.append('image', file));
    } else if (updateData.image) {
      formdata.append('image', updateData.image);
    }

    formdata.append('prize', updateData.prize !== undefined ? updateData.prize : product.prize);
    formdata.append('stock', updateData.stock !== undefined ? updateData.stock : (product.stock || 'In Stock'));
    formdata.append('size', updateData.size !== undefined ? updateData.size : product.size);
    formdata.append('material', updateData.material !== undefined ? updateData.material : product.material);

    try {
      await api.put(`/product/updateproduct/${id}`, formdata);
      setShowEdit(false);
      setEditErrors({});
      fetchProductDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product details.');
    } finally {
      setSavingEdit(false);
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

  const parseImages = (imgData) => {
    if (!imgData) return ['/images/ethnic.jpg'];
    if (Array.isArray(imgData)) return imgData.length > 0 ? imgData : ['/images/ethnic.jpg'];
    if (typeof imgData === 'string') {
      if (imgData.startsWith('[')) {
        try {
          const parsed = JSON.parse(imgData);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          // fallback
        }
      }
      return [imgData];
    }
    return ['/images/ethnic.jpg'];
  };

  const images = parseImages(product.image);

  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

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

                {/* Top Status & Photo Counter */}
                <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {images.length > 1 && (
                    <span style={{ background: 'rgba(0,0,0,0.65)', color: '#a5b4fc', fontSize: '0.8rem', fontWeight: 600, padding: '0.35rem 0.75rem', borderRadius: '20px', backdropFilter: 'blur(4px)', border: '1px solid rgba(165,180,252,0.3)' }}>
                      📷 {selectedImage + 1} / {images.length}
                    </span>
                  )}
                  {product.status !== 'deleted' && product.stock !== 'Out of Stock' ? (
                    <span className="status-pill delivered" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>In Stock</span>
                  ) : (
                    <span className="status-pill out-of-stock" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>Out of Stock</span>
                  )}
                </div>

                {/* Left & Right Prev/Next Overlay Buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(0,0,0,0.5)',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        fontSize: '1.4rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(4px)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.8)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextImage}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(0,0,0,0.5)',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        fontSize: '1.4rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(4px)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.8)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails list if multiple images */}
              {images.length > 1 && (
                <div className="d-flex gap-2 mt-3 overflow-auto pb-1">
                  {images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        onClick={() => setSelectedImage(idx)}
                        style={{
                          width: '75px',
                          height: '75px',
                          objectFit: 'cover',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          border: selectedImage === idx ? '2px solid #a5b4fc' : '1px solid rgba(255,255,255,0.15)',
                          opacity: selectedImage === idx ? 1 : 0.5,
                          transition: 'all 0.2s ease'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Col>

            {/* Right Column: Detailed Information & Actions */}
            <Col xs={12} lg={6}>
              <div className="d-flex flex-column justify-content-between h-100">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="status-pill ordered" style={{ display: 'inline-block' }}>
                      {product.category || "Women"}
                    </span>
                    <span className="status-pill processing" style={{ display: 'inline-block' }}>
                      {product.style || "Casual Wear"}
                    </span>
                    {product.stock !== 'Out of Stock' ? (
                      <span className="status-pill delivered" style={{ fontSize: '0.75rem' }}>
                        {product.stock || 'In Stock'}
                      </span>
                    ) : (
                      <span className="status-pill out-of-stock" style={{ fontSize: '0.75rem' }}>
                        Out of Stock
                      </span>
                    )}
                  </div>

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
                      <span style={{ width: '130px', color: '#9ca3af', fontWeight: 500 }}>Category:</span>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>
                        {product.category || "Women"}
                      </span>
                    </div>

                    <div className="d-flex align-items-center">
                      <span style={{ width: '130px', color: '#9ca3af', fontWeight: 500 }}>Dress Style:</span>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>
                        {product.style || "Casual Wear"}
                      </span>
                    </div>

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
                      <span style={{ width: '130px', color: '#9ca3af', fontWeight: 500 }}>Stock Level:</span>
                      <span style={{ color: product.stock !== 'Out of Stock' ? '#34d399' : '#f87171', fontWeight: 600 }}>
                        {product.stock || 'In Stock'}
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
                      Product Description
                    </h5>
                    <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>
                      {product.description || `Handcrafted with premium ${product.material} fabric tailored for elegant fit and lasting durability.`}
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
                      {product.status !== 'deleted' && product.stock !== 'Out of Stock' ? (
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

            <Row className="g-2 mb-3">
              <Col xs={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Category</Form.Label>
                  <Form.Select
                    name="category"
                    defaultValue={product.category || 'Women'}
                    className="glass-input"
                    onChange={handleEditChange}
                  >
                    <option value="Women" style={{ color: '#000' }}>Women</option>
                    <option value="Men" style={{ color: '#000' }}>Men</option>
                    <option value="Kids" style={{ color: '#000' }}>Kids</option>
                    <option value="Unisex" style={{ color: '#000' }}>Unisex</option>
                  </Form.Select>
                  {editErrors.category && <span className="glass-error-badge">{editErrors.category}</span>}
                </Form.Group>
              </Col>

              <Col xs={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Style</Form.Label>
                  <Form.Select
                    name="style"
                    defaultValue={product.style || 'Casual Wear'}
                    className="glass-input"
                    onChange={handleEditChange}
                  >
                    <option value="Casual Wear" style={{ color: '#000' }}>Casual Wear</option>
                    <option value="Party Wear" style={{ color: '#000' }}>Party Wear</option>
                    <option value="Ethnic Wear" style={{ color: '#000' }}>Ethnic Wear</option>
                    <option value="Formal Wear" style={{ color: '#000' }}>Formal Wear</option>
                    <option value="Wedding Wear" style={{ color: '#000' }}>Wedding Wear</option>
                    <option value="Sportswear" style={{ color: '#000' }}>Sportswear</option>
                  </Form.Select>
                  {editErrors.style && <span className="glass-error-badge">{editErrors.style}</span>}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Product Images (Select multiple to update)</Form.Label>
              <Form.Control
                type="file"
                name="image"
                multiple
                accept="image/*"
                className="glass-input"
                onChange={handleFileChange}
              />
              {updateData.imageFiles && updateData.imageFiles.length > 0 && (
                <div className="d-flex gap-2 mt-2 flex-wrap">
                  {updateData.imageFiles.map((file, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '50px', height: '50px' }}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(165,180,252,0.5)' }}
                      />
                      <span style={{ position: 'absolute', bottom: '1px', right: '1px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.6rem', padding: '1px 3px', borderRadius: '3px' }}>
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Form.Group>

            <Row className="g-2 mb-3">
              <Col xs={6}>
                <Form.Group>
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
              </Col>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Stock Status</Form.Label>
                  <Form.Select
                    name="stock"
                    defaultValue={product.stock || 'In Stock'}
                    className="glass-input"
                    onChange={handleEditChange}
                  >
                    <option value="In Stock" style={{ color: '#000' }}>In Stock</option>
                    <option value="Low Stock" style={{ color: '#000' }}>Low Stock</option>
                    <option value="Out of Stock" style={{ color: '#000' }}>Out of Stock</option>
                  </Form.Select>
                  {editErrors.stock && <span className="glass-error-badge">{editErrors.stock}</span>}
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-2 mb-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="glass-label">Available Sizes (Select multiple)</Form.Label>
                  <div className="d-flex flex-wrap gap-2 pt-1">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((sz) => {
                      const currentSelected = updateData.selectedSizes !== undefined
                        ? updateData.selectedSizes
                        : (product?.size ? product.size.split(',').map(s => s.trim()).filter(Boolean) : []);
                      const isSelected = currentSelected.includes(sz);
                      return (
                        <Button
                          key={sz}
                          type="button"
                          className={isSelected ? "btn-glass-primary py-1 px-3" : "btn-glass-secondary py-1 px-3"}
                          style={{
                            fontSize: '0.85rem',
                            borderRadius: '8px',
                            border: isSelected ? '1px solid #a5b4fc' : '1px solid rgba(255,255,255,0.15)',
                            boxShadow: isSelected ? '0 0 10px rgba(165,180,252,0.3)' : 'none'
                          }}
                          onClick={() => handleEditSizeToggle(sz)}
                        >
                          {isSelected ? `✓ ${sz}` : sz}
                        </Button>
                      );
                    })}
                  </div>
                  {editErrors.size && <span className="glass-error-badge mt-2 d-block">{editErrors.size}</span>}
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-2 mb-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="glass-label">Material & Fabric Info</Form.Label>
                  <Form.Control
                    type="text"
                    name="material"
                    defaultValue={product.material}
                    className="glass-input"
                    onChange={handleEditChange}
                  />
                  {editErrors.material && <span className="glass-error-badge">{editErrors.material}</span>}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                defaultValue={product.description || ''}
                className="glass-input"
                onChange={handleEditChange}
              />
              {editErrors.description && <span className="glass-error-badge">{editErrors.description}</span>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-secondary" onClick={() => setShowEdit(false)} disabled={savingEdit}>
            Cancel
          </Button>
          <Button className="btn-glass-primary" onClick={handleSaveUpdate} disabled={savingEdit}>
            {savingEdit ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SingleProduct;
