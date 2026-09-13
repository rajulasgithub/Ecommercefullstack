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
import Spinner from "react-bootstrap/Spinner";
import api from '../utils/api';
import ROLES from '../utils/roles';
import { isNumeric, isEmpty, MATERIALS, STYLES } from '../utils/validation';

const ProductCardItem = ({ item, role, navigate, handleShow, dltproduct, setStatus, handleSubmit }) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const parseImages = (imgData) => {
    if (!imgData) return ['/images/ethnic.jpg'];
    if (Array.isArray(imgData)) return imgData.length > 0 ? imgData : ['/images/ethnic.jpg'];
    if (typeof imgData === 'string') {
      if (imgData.startsWith('[')) {
        try {
          const parsed = JSON.parse(imgData);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) { }
      }
      return [imgData];
    }
    return ['/images/ethnic.jpg'];
  };

  const images = parseImages(item.image);

  const nextImg = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <Col xs={12} sm={6} md={4} lg={3}>
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
              marginBottom: "0.5rem",
              backgroundColor: "rgba(0,0,0,0.3)",
              cursor: "pointer"
            }}
          >
            <img
              src={images[activeImgIndex] || images[0]}
              alt={item.prdName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
                transition: "transform 0.4s ease"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.08)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            />

            {/* Photo Counter Badge & Stock Pill */}
            <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "6px", alignItems: "center" }}>
              {images.length > 1 && (
                <span style={{ background: "rgba(0,0,0,0.7)", color: "#a5b4fc", fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.5rem", borderRadius: "10px", backdropFilter: "blur(4px)", border: "1px solid rgba(165,180,252,0.3)" }}>
                  📷 {activeImgIndex + 1}/{images.length}
                </span>
              )}
              {item.status !== 'deleted' && item.stock !== 'Out of Stock' ? (
                <span className="status-pill delivered" style={{ fontSize: "0.75rem" }}>{item.stock || 'In Stock'}</span>
              ) : (
                <span className="status-pill out-of-stock" style={{ fontSize: "0.75rem" }}>Out of Stock</span>
              )}
            </div>

            {/* Left & Right Prev/Next Overlay Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  style={{
                    position: 'absolute',
                    left: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.5)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)',
                    zIndex: 2
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={nextImg}
                  style={{
                    position: 'absolute',
                    right: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.5)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)',
                    zIndex: 2
                  }}
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Mini Thumbnail Dots Strip if Multiple Images */}
          {images.length > 1 && (
            <div className="d-flex gap-1 mb-2 justify-content-center overflow-auto">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumb ${idx + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImgIndex(idx);
                  }}
                  style={{
                    width: '30px',
                    height: '30px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    border: activeImgIndex === idx ? '2px solid #a5b4fc' : '1px solid rgba(255,255,255,0.15)',
                    opacity: activeImgIndex === idx ? 1 : 0.5,
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          )}

          {/* Details */}
          <div className="mb-2 d-flex gap-1 flex-wrap">
            <span className="status-pill ordered" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
              {item.category || "Women"}
            </span>
            <span className="status-pill processing" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
              {item.style || "Casual Wear"}
            </span>
          </div>

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

          <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: "0.4rem" }}>
            Material: {item.material}
          </p>
          <p style={{ fontSize: "0.8rem", color: item.stock !== 'Out of Stock' ? "#34d399" : "#f87171", marginBottom: "1rem" }}>
            Stock: {item.stock || 'In Stock'}
          </p>
        </div>

        {/* Actions depending on Role */}
        <div>
          {role === ROLES.COMPANY || role === ROLES.ADMIN ? (
            <div className="d-flex flex-column gap-2">
              {item.status !== 'deleted' ? (
                <div className="d-flex gap-2">
                  <Button className="btn-glass-secondary w-50 py-1" size="sm" onClick={() => handleShow(item._id)}>
                    Edit
                  </Button>
                  <Button className="btn-glass-danger w-50 py-1" size="sm" onClick={() => dltproduct(item)}>
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
                  <option value="active" style={{ color: "#000" }}>Restock Product</option>
                </Form.Select>
              )}
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Button className="btn-glass-secondary w-50" size="sm" onClick={() => navigate(`/product/${item._id}`)}>
                Details
              </Button>
              {item.status !== 'deleted' && item.stock !== 'Out of Stock' ? (
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
  );
};

const Viewproduct = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [product, setProduct] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [updateprdt, setUpdateprdt] = useState({});
  const [modalError, setModalError] = useState({});
  const [activeItemId, setActiveItemId] = useState(null);
  const [show, setShow] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const isVendorOrAdmin = role === ROLES.COMPANY || role === ROLES.ADMIN;
    const url = isVendorOrAdmin ? '/product/viewproduct?includeDeleted=true' : '/product/viewproduct';
    api.get(url)
      .then((response) => {
        setProduct(response.data.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [role]);

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

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const dltproduct = (item) => {
    setDeleteTarget({ id: item._id, prdName: item.prdName });
  };

  const confirmDeleteSingleProduct = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    api.put(`/product/deleteproduct/${deleteTarget.id}`)
      .then(() => {
        setProduct(product.filter(p => p._id !== deleteTarget.id));
        setDeleteTarget(null);
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Failed to delete product.";
        setErrorMsg(msg);
        setDeleteTarget(null);
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  const deleteAllProductsHandler = () => {
    setShowDeleteAllModal(true);
  };

  const confirmDeleteAllProducts = () => {
    setDeleting(true);
    api.put('/product/deleteallproduct')
      .then(() => {
        setProduct([]);
        setShowDeleteAllModal(false);
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Failed to delete all products.";
        setErrorMsg(msg);
        setShowDeleteAllModal(false);
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  const handleChange = (event) => {
    setUpdateprdt({ ...updateprdt, [event.target.name]: event.target.value });
    setModalError({ ...modalError, [event.target.name]: '' });
  };

  const handleModalSizeToggle = (sz) => {
    const current = updateprdt.selectedSizes || [];
    const updated = current.includes(sz) ? current.filter(s => s !== sz) : [...current, sz];
    const sizeStr = updated.join(', ');
    setUpdateprdt({
      ...updateprdt,
      selectedSizes: updated,
      size: sizeStr
    });
    if (sizeStr.trim()) {
      setModalError({ ...modalError, size: '' });
    } else {
      setModalError({ ...modalError, size: 'At least one size must be selected' });
    }
  };

  const fileChange = (event) => {
    const files = Array.from(event.target.files);
    setUpdateprdt({ ...updateprdt, imageFiles: files, image: files[0] });
  };

  const validateUpdate = () => {
    const errs = {};
    if (isEmpty(updateprdt.prdName)) {
      errs.prdName = "Product name is required";
    }
    if (isEmpty(updateprdt.category)) {
      errs.category = "Category is required";
    }
    if (isEmpty(updateprdt.style)) {
      errs.style = "Style is required";
    }
    if (isEmpty(updateprdt.prize)) {
      errs.prize = "Price is required";
    } else if (!isNumeric(updateprdt.prize) || Number(updateprdt.prize) <= 0) {
      errs.prize = "Price must be a positive number greater than 0";
    }
    if (isEmpty(updateprdt.stock)) {
      errs.stock = "Stock status is required";
    }
    if (isEmpty(updateprdt.size) || (updateprdt.selectedSizes && updateprdt.selectedSizes.length === 0)) {
      errs.size = "At least one size must be selected";
    }
    if (isEmpty(updateprdt.material)) {
      errs.material = "Material is required";
    }
    if (isEmpty(updateprdt.description)) {
      errs.description = "Product description is required";
    } else if (updateprdt.description.trim().length < 10 || updateprdt.description.trim().length > 1000) {
      errs.description = "Description must be between 10 and 1000 characters";
    }

    setModalError(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdate = (id) => {
    if (!validateUpdate()) return;

    setUpdating(true);
    const formdata = new FormData();
    formdata.append('prdName', updateprdt.prdName || '');
    formdata.append('category', updateprdt.category || 'Women');
    formdata.append('style', updateprdt.style || 'Casual Wear');
    formdata.append('description', updateprdt.description || '');

    if (updateprdt.imageFiles && updateprdt.imageFiles.length > 0) {
      updateprdt.imageFiles.forEach((file) => formdata.append('image', file));
    } else if (updateprdt.image) {
      formdata.append('image', updateprdt.image);
    }

    formdata.append('prize', updateprdt.prize || '');
    formdata.append('stock', updateprdt.stock !== undefined ? updateprdt.stock : 'In Stock');
    formdata.append('size', updateprdt.size || '');
    formdata.append('material', updateprdt.material || '');

    api.put(`/product/updateproduct/${id}`, formdata)
      .then((response) => {
        handleClose();
        // Refresh product list
        const isVendorOrAdmin = role === ROLES.COMPANY || role === ROLES.ADMIN;
        const url = isVendorOrAdmin ? '/product/viewproduct?includeDeleted=true' : '/product/viewproduct';
        api.get(url).then((res) => setProduct(res.data.data || []));
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Failed to update product.";
        setErrorMsg(msg);
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const handleClose = () => {
    setShow(false);
    setActiveItemId(null);
    setModalError({});
  };

  const handleShow = (id) => {
    const currentItem = product.find(p => p._id === id) || {};
    const initialSizes = currentItem.size ? currentItem.size.split(',').map(s => s.trim()).filter(Boolean) : [];
    setActiveItemId(id);
    setUpdateprdt({
      prdName: currentItem.prdName || '',
      category: currentItem.category || 'Women',
      style: currentItem.style || 'Casual Wear',
      description: currentItem.description || '',
      prize: currentItem.prize || '',
      stock: currentItem.stock !== undefined ? currentItem.stock : 'In Stock',
      size: currentItem.size || '',
      selectedSizes: initialSizes,
      material: currentItem.material || ''
    });
    setModalError({});
    setShow(true);
  };

  const setStatus = (id, value) => {
    api.put(`/product/updateproductstatus/${id}/${value}`)
      .then((response) => {
        const isVendorOrAdmin = role === ROLES.COMPANY || role === ROLES.ADMIN;
        const url = isVendorOrAdmin ? '/product/viewproduct?includeDeleted=true' : '/product/viewproduct';
        api.get(url).then((res) => setProduct(res.data.data || []));
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Failed to update status.";
        setErrorMsg(msg);
      });
  };

  const filteredProducts = product.filter((item) => {
    // Customers/Buyers must never see soft-deleted products
    if (role !== ROLES.COMPANY && role !== ROLES.ADMIN && item.status === 'deleted') {
      return false;
    }
    return (
      item.prdName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.style?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.material?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
        <Row className="justify-content-center align-items-center mb-4 g-2">
          <Col xs={12} md={role === ROLES.COMPANY || role === ROLES.ADMIN ? 7 : 8}>
            <Form.Control
              type="text"
              placeholder="🔍 Search dresses, fabric, material..."
              className="glass-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          {(role === ROLES.COMPANY || role === ROLES.ADMIN) && product.length > 0 && (
            <Col xs={12} md={3} className="text-md-end">
              <Button className="btn-glass-danger py-2 w-100" onClick={deleteAllProductsHandler}>
                🗑️ Delete All Products
              </Button>
            </Col>
          )}
        </Row>

        {/* Products Grid */}
        <Row className="g-4">
          {filteredProducts.map((item) => (
            <ProductCardItem
              key={item._id}
              item={item}
              role={role}
              navigate={navigate}
              handleShow={handleShow}
              dltproduct={dltproduct}
              setStatus={setStatus}
              handleSubmit={handleSubmit}
            />
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
                value={updateprdt.prdName || ''}
                onChange={handleChange}
              />
              {modalError.prdName && <span className="glass-error-badge">{modalError.prdName}</span>}
            </Form.Group>

            <Row className="g-2 mb-3">
              <Col xs={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Category</Form.Label>
                  <Form.Select
                    name="category"
                    className="glass-input"
                    value={updateprdt.category || ''}
                    onChange={handleChange}
                  >
                    <option value="Women" style={{ color: '#000' }}>Women</option>
                    <option value="Men" style={{ color: '#000' }}>Men</option>
                    <option value="Kids" style={{ color: '#000' }}>Kids</option>
                    <option value="Unisex" style={{ color: '#000' }}>Unisex</option>
                  </Form.Select>
                  {modalError.category && <span className="glass-error-badge">{modalError.category}</span>}
                </Form.Group>
              </Col>

              <Col xs={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Style</Form.Label>
                  <Form.Select
                    name="style"
                    className="glass-input"
                    value={updateprdt.style || ''}
                    onChange={handleChange}
                  >
                    <option value="" style={{ color: '#000' }}>Select Style</option>
                    {STYLES.map((st) => (
                      <option key={st} value={st} style={{ color: '#000' }}>
                        {st}
                      </option>
                    ))}
                  </Form.Select>
                  {modalError.style && <span className="glass-error-badge">{modalError.style}</span>}
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
                onChange={fileChange}
              />
              {updateprdt.imageFiles && updateprdt.imageFiles.length > 0 && (
                <div className="d-flex gap-2 mt-2 flex-wrap">
                  {updateprdt.imageFiles.map((file, idx) => (
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
                    placeholder="Price"
                    name="prize"
                    className="glass-input"
                    value={updateprdt.prize || ''}
                    onChange={handleChange}
                  />
                  {modalError.prize && <span className="glass-error-badge">{modalError.prize}</span>}
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Stock Status</Form.Label>
                  <Form.Select
                    name="stock"
                    className="glass-input"
                    value={updateprdt.stock || 'In Stock'}
                    onChange={handleChange}
                  >
                    <option value="In Stock" style={{ color: '#000' }}>In Stock</option>
                    <option value="Low Stock" style={{ color: '#000' }}>Low Stock</option>
                    <option value="Out of Stock" style={{ color: '#000' }}>Out of Stock</option>
                  </Form.Select>
                  {modalError.stock && <span className="glass-error-badge">{modalError.stock}</span>}
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-2 mb-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="glass-label">Available Sizes (Select multiple)</Form.Label>
                  <div className="d-flex flex-wrap gap-2 pt-1">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((sz) => {
                      const isSelected = (updateprdt.selectedSizes || []).includes(sz);
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
                          onClick={() => handleModalSizeToggle(sz)}
                        >
                          {isSelected ? `✓ ${sz}` : sz}
                        </Button>
                      );
                    })}
                  </div>
                  {modalError.size && <span className="glass-error-badge mt-2 d-block">{modalError.size}</span>}
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-2 mb-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="glass-label">Material & Fabric Info</Form.Label>
                  <Form.Select
                    name="material"
                    className="glass-input"
                    value={updateprdt.material || ''}
                    onChange={handleChange}
                  >
                    <option value="" style={{ color: '#000' }}>Select Material</option>
                    {MATERIALS.map((mat) => (
                      <option key={mat} value={mat} style={{ color: '#000' }}>
                        {mat}
                      </option>
                    ))}
                  </Form.Select>
                  {modalError.material && <span className="glass-error-badge">{modalError.material}</span>}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Product description"
                name="description"
                className="glass-input"
                value={updateprdt.description || ''}
                onChange={handleChange}
              />
              {modalError.description && <span className="glass-error-badge">{modalError.description}</span>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-secondary" onClick={handleClose} disabled={updating}>
            Cancel
          </Button>
          <Button className="btn-glass-primary" onClick={() => handleUpdate(activeItemId)} disabled={updating}>
            {updating ? (
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

      {/* Confirmation Modal for Single Product Deletion */}
      <Modal show={!!deleteTarget} onHide={() => setDeleteTarget(null)} centered contentClassName="glass-modal">
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title style={{ color: "#ffffff", fontWeight: 700 }}>Confirm Product Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h5 style={{ color: '#ffffff', fontWeight: 600, marginBottom: '0.5rem' }}>
            Are you sure you want to delete this product?
          </h5>
          {deleteTarget && (
            <p style={{ color: '#a5b4fc', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              "{deleteTarget.prdName}"
            </p>
          )}
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
            This will soft-delete the listing and remove active cart items for this product.
          </p>
        </Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button className="btn-glass-danger" onClick={confirmDeleteSingleProduct} disabled={deleting}>
            {deleting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Deleting...
              </>
            ) : (
              '🗑️ Delete Product'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal for Deleting All Products */}
      <Modal show={showDeleteAllModal} onHide={() => setShowDeleteAllModal(false)} centered contentClassName="glass-modal">
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title style={{ color: "#ffffff", fontWeight: 700 }}>Clear All Products</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚨</div>
          <h5 style={{ color: '#ffffff', fontWeight: 600, marginBottom: '0.5rem' }}>
            Are you sure you want to delete ALL product listings?
          </h5>
          <p style={{ color: '#f87171', fontSize: '0.875rem', margin: 0 }}>
            This action will soft-delete all product listings and clear corresponding active cart items.
          </p>
        </Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-secondary" onClick={() => setShowDeleteAllModal(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button className="btn-glass-danger" onClick={confirmDeleteAllProducts} disabled={deleting}>
            {deleting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Deleting All...
              </>
            ) : (
              '🗑️ Delete All Products'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Viewproduct;