import React, { useState, useEffect, useCallback } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Header from './Header';
import Addproduct from './Addproduct';
import Vieworders from './Vieworders';
import { isNumeric, isEmpty, MATERIALS, STYLES } from '../utils/validation';
import './SellerDashboard.css';
import './Style.css';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('my-products');

  // Products state for My Products tab
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editError, setEditError] = useState({});
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [clearAllSubmitting, setClearAllSubmitting] = useState(false);

  // Fetch seller's products from backend
  const fetchSellerProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/product/sellerproducts', {
        params: {
          search: searchTerm.trim() || undefined,
          page,
          limit,
        },
      });

      if (response.data && response.data.success) {
        setProducts(response.data.data || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch seller products.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page, limit]);

  useEffect(() => {
    if (activeTab === 'my-products') {
      fetchSellerProducts();
    }
  }, [fetchSellerProducts, activeTab]);

  // Handle Search Submission
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  // Helper to parse image URL
  const getProductImage = (imgData) => {
    if (!imgData) return '/images/ethnic.jpg';
    if (Array.isArray(imgData) && imgData.length > 0) return imgData[0];
    if (typeof imgData === 'string') {
      if (imgData.startsWith('[')) {
        try {
          const parsed = JSON.parse(imgData);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
        } catch (e) {}
      }
      return imgData;
    }
    return '/images/ethnic.jpg';
  };

  // Open Edit Modal prefilled
  const openEditModal = (product) => {
    setEditingProduct(product);
    let selectedSizesArr = [];
    if (product.size) {
      selectedSizesArr = product.size.split(',').map((s) => s.trim()).filter(Boolean);
    }
    setEditFormData({
      prdName: product.prdName || '',
      category: product.category || 'Women',
      style: product.style || 'Casual Wear',
      prize: product.prize || '',
      stock: product.stock || 'In Stock',
      material: product.material || 'Cotton',
      size: product.size || '',
      selectedSizes: selectedSizesArr,
      description: product.description || '',
    });
    setEditError({});
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    setEditError({ ...editError, [e.target.name]: '' });
  };

  const handleEditSizeToggle = (sz) => {
    const current = editFormData.selectedSizes || [];
    const updated = current.includes(sz) ? current.filter((s) => s !== sz) : [...current, sz];
    const sizeStr = updated.join(', ');
    setEditFormData({
      ...editFormData,
      selectedSizes: updated,
      size: sizeStr,
    });
    if (sizeStr.trim()) {
      setEditError({ ...editError, size: '' });
    } else {
      setEditError({ ...editError, size: 'At least one size must be selected' });
    }
  };

  const handleEditFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setEditFormData({ ...editFormData, imageFiles: files });
    }
  };

  const validateEditForm = () => {
    const errs = {};
    if (isEmpty(editFormData.prdName)) errs.prdName = 'Product name is required';
    if (isEmpty(editFormData.category)) errs.category = 'Category is required';
    if (isEmpty(editFormData.style)) errs.style = 'Style is required';
    if (isEmpty(editFormData.prize)) {
      errs.prize = 'Price is required';
    } else if (!isNumeric(editFormData.prize) || Number(editFormData.prize) <= 0) {
      errs.prize = 'Price must be a positive number greater than 0';
    }
    if (isEmpty(editFormData.stock)) errs.stock = 'Stock status is required';
    if (isEmpty(editFormData.size) || (editFormData.selectedSizes && editFormData.selectedSizes.length === 0)) {
      errs.size = 'At least one size must be selected';
    }
    if (isEmpty(editFormData.material)) errs.material = 'Material is required';
    if (isEmpty(editFormData.description)) {
      errs.description = 'Product description is required';
    } else if (editFormData.description.trim().length < 10 || editFormData.description.trim().length > 1000) {
      errs.description = 'Description must be between 10 and 1000 characters';
    }
    setEditError(errs);
    return Object.keys(errs).length === 0;
  };

  const submitEditProduct = async (e) => {
    e.preventDefault();
    if (!validateEditForm()) {
      toast.error('Please resolve validation errors before saving.');
      return;
    }

    setEditSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('prdName', editFormData.prdName);
      formData.append('category', editFormData.category);
      formData.append('style', editFormData.style);
      formData.append('prize', editFormData.prize);
      formData.append('stock', editFormData.stock);
      formData.append('size', editFormData.size);
      formData.append('material', editFormData.material);
      formData.append('description', editFormData.description);

      if (editFormData.imageFiles && editFormData.imageFiles.length > 0) {
        editFormData.imageFiles.forEach((file) => {
          formData.append('image', file);
        });
      }

      const response = await api.put(`/product/updateproduct/${editingProduct._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data && response.data.success) {
        toast.success('Product updated successfully!');
        setShowEditModal(false);
        fetchSellerProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product.');
    } finally {
      setEditSubmitting(false);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    setDeleteSubmitting(true);
    try {
      const response = await api.put(`/product/deleteproduct/${deletingProduct._id}`);
      if (response.data && response.data.success) {
        toast.success(`"${deletingProduct.prdName}" deleted successfully.`);
        setShowDeleteModal(false);
        fetchSellerProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // Confirm Clear All Products
  const confirmClearAll = async () => {
    setClearAllSubmitting(true);
    try {
      const response = await api.put('/product/deleteallproduct');
      if (response.data && response.data.success) {
        toast.success('All your products have been deleted successfully.');
        setShowClearAllModal(false);
        fetchSellerProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to clear all products.');
    } finally {
      setClearAllSubmitting(false);
    }
  };

  return (
    <div className="page-container d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Header />

      <div className="seller-dashboard-container flex-grow-1">
        {/* Sidebar */}
        <aside className="seller-sidebar">
          <div>
            <div className="seller-sidebar-header">
              <div className="seller-sidebar-title">
                <span>🏪</span> Seller Portal
              </div>
              <div className="seller-sidebar-subtitle">Manage your inventory & sales</div>
            </div>

            <nav className="seller-nav-menu">
              <button
                className={`seller-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <span>📊</span> Dashboard Overview
              </button>

              <button
                className={`seller-nav-item ${activeTab === 'my-products' ? 'active' : ''}`}
                onClick={() => setActiveTab('my-products')}
              >
                <span>📦</span> My Products
              </button>

              <button
                className={`seller-nav-item ${activeTab === 'add-product' ? 'active' : ''}`}
                onClick={() => setActiveTab('add-product')}
              >
                <span>➕</span> Add Product
              </button>

              <button
                className={`seller-nav-item ${activeTab === 'manage-orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('manage-orders')}
              >
                <span>🛒</span> Manage Orders
              </button>
            </nav>
          </div>

          <div className="pt-3 border-top border-secondary-subtle" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Logged in as <strong style={{ color: 'var(--primary-accent)' }}>Seller</strong>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="seller-main-content">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div className="seller-page-header">
                <div className="seller-header-title">
                  <h2>Dashboard Overview</h2>
                  <p>Quick metrics and inventory shortcuts for your seller profile</p>
                </div>
                <div className="seller-header-actions">
                  <button className="btn-seller-primary" onClick={() => setActiveTab('add-product')}>
                    + Add New Product
                  </button>
                </div>
              </div>

              <Row className="g-4 mb-4">
                <Col xs={12} sm={6} md={4}>
                  <div className="glass-card p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Products</span>
                      <span style={{ fontSize: '1.5rem' }}>📦</span>
                    </div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--primary-accent)' }}>
                      {pagination.total || products.length}
                    </h3>
                  </div>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <div className="glass-card p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Seller Status</span>
                      <span style={{ fontSize: '1.5rem' }}>✅</span>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#10b981' }}>
                      Active Merchant
                    </h3>
                  </div>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <div className="glass-card p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Quick Action</span>
                      <span style={{ fontSize: '1.5rem' }}>🚀</span>
                    </div>
                    <button className="btn-seller-edit w-100" onClick={() => setActiveTab('my-products')}>
                      View My Catalog →
                    </button>
                  </div>
                </Col>
              </Row>
            </div>
          )}

          {/* TAB 2: MY PRODUCTS */}
          {activeTab === 'my-products' && (
            <div>
              <div className="seller-page-header">
                <div className="seller-header-title">
                  <h2>My Products</h2>
                  <p>Displaying only products added by your account ({pagination.total} total)</p>
                </div>

                <div className="seller-header-actions">
                  <div className="seller-search-box">
                    <span className="seller-search-icon">🔍</span>
                    <input
                      type="text"
                      className="seller-search-input"
                      placeholder="Search my products..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>

                  {products.length > 0 && (
                    <button className="btn-seller-danger" onClick={() => setShowClearAllModal(true)}>
                      <span>🗑️</span> Clear All My Products
                    </button>
                  )}

                  <button className="btn-seller-primary" onClick={() => setActiveTab('add-product')}>
                    <span>➕</span> Add Product
                  </button>
                </div>
              </div>

              {/* Products Loading State */}
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Loading your products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="glass-card text-center py-5 px-4 my-4">
                  <div style={{ fontSize: '3rem' }}>🛍️</div>
                  <h4 className="mt-3">No Products Found</h4>
                  <p style={{ color: 'var(--text-muted)' }}>
                    {searchTerm ? `No products match "${searchTerm}".` : 'You have not added any products yet.'}
                  </p>
                  <button className="btn-seller-primary mx-auto mt-2" onClick={() => setActiveTab('add-product')}>
                    Add Your First Product
                  </button>
                </div>
              ) : (
                <>
                  <Row className="g-4">
                    {products.map((item) => (
                      <Col xs={12} sm={6} md={4} lg={3} key={item._id}>
                        <div className="seller-product-card">
                          <div className="seller-card-image-wrap">
                            <img
                              src={getProductImage(item.image)}
                              alt={item.prdName}
                              className="seller-card-img"
                              onError={(e) => {
                                e.target.src = '/images/ethnic.jpg';
                              }}
                            />
                            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                              <span className={`status-pill ${item.stock === 'Out of Stock' ? 'out-of-stock' : 'delivered'}`}>
                                {item.stock || 'In Stock'}
                              </span>
                            </div>
                          </div>

                          <div className="seller-card-body">
                            <div>
                              <h4 className="seller-card-title" title={item.prdName}>
                                {item.prdName}
                              </h4>

                              <div className="seller-card-badge-row">
                                <span className="seller-card-badge">{item.category}</span>
                                {item.style && <span className="seller-card-badge">{item.style}</span>}
                              </div>

                              <div className="seller-card-price">₹{item.prize}</div>
                            </div>

                            <div className="seller-card-actions">
                              <button className="btn-seller-edit" onClick={() => openEditModal(item)}>
                                ✏️ Edit
                              </button>
                              <button className="btn-seller-delete" onClick={() => openDeleteModal(item)}>
                                🗑️ Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>

                  {/* Server Pagination */}
                  <div className="seller-pagination-bar">
                    <div className="seller-pagination-info">
                      Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} items)
                    </div>

                    <div className="seller-pagination-controls">
                      <button
                        className="seller-page-btn"
                        disabled={pagination.page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        ← Previous
                      </button>

                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pNum) => (
                        <button
                          key={pNum}
                          className={`seller-page-btn ${pagination.page === pNum ? 'active' : ''}`}
                          onClick={() => setPage(pNum)}
                        >
                          {pNum}
                        </button>
                      ))}

                      <button
                        className="seller-page-btn"
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: ADD PRODUCT */}
          {activeTab === 'add-product' && (
            <div>
              <div className="seller-page-header">
                <div className="seller-header-title">
                  <h2>Add New Product</h2>
                  <p>Add a new clothing item to your seller catalog</p>
                </div>
                <button className="btn-seller-edit" onClick={() => setActiveTab('my-products')}>
                  ← Back to My Products
                </button>
              </div>
              <Addproduct hideHeader={true} onSuccess={() => setActiveTab('my-products')} />
            </div>
          )}

          {/* TAB 4: MANAGE ORDERS */}
          {activeTab === 'manage-orders' && (
            <div>
              <div className="seller-page-header">
                <div className="seller-header-title">
                  <h2>Manage Orders</h2>
                  <p>Track customer purchases and update order statuses</p>
                </div>
                <button className="btn-seller-edit" onClick={() => setActiveTab('my-products')}>
                  ← Back to My Products
                </button>
              </div>
              <Vieworders hideHeader={true} />
            </div>
          )}
        </main>
      </div>

      {/* EDIT PRODUCT MODAL */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg" contentClassName="glass-modal">
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--app-text-main)' }}>
            ✏️ Edit Product Details
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitEditProduct}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="prdName"
                    className="glass-input"
                    value={editFormData.prdName || ''}
                    onChange={handleEditChange}
                  />
                  {editError.prdName && <span className="glass-error-badge">{editError.prdName}</span>}
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="prize"
                    className="glass-input"
                    value={editFormData.prize || ''}
                    onChange={handleEditChange}
                  />
                  {editError.prize && <span className="glass-error-badge">{editError.prize}</span>}
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label className="glass-label">Category</Form.Label>
                  <Form.Select
                    name="category"
                    className="glass-input"
                    value={editFormData.category || 'Women'}
                    onChange={handleEditChange}
                  >
                    <option value="Men" style={{ color: '#000' }}>Men</option>
                    <option value="Women" style={{ color: '#000' }}>Women</option>
                    <option value="Kids" style={{ color: '#000' }}>Kids</option>
                    <option value="Unisex" style={{ color: '#000' }}>Unisex</option>
                  </Form.Select>
                  {editError.category && <span className="glass-error-badge">{editError.category}</span>}
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label className="glass-label">Style</Form.Label>
                  <Form.Select
                    name="style"
                    className="glass-input"
                    value={editFormData.style || 'Casual Wear'}
                    onChange={handleEditChange}
                  >
                    {STYLES.map((st) => (
                      <option key={st} value={st} style={{ color: '#000' }}>
                        {st}
                      </option>
                    ))}
                  </Form.Select>
                  {editError.style && <span className="glass-error-badge">{editError.style}</span>}
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label className="glass-label">Material</Form.Label>
                  <Form.Select
                    name="material"
                    className="glass-input"
                    value={editFormData.material || 'Cotton'}
                    onChange={handleEditChange}
                  >
                    {MATERIALS.map((mat) => (
                      <option key={mat} value={mat} style={{ color: '#000' }}>
                        {mat}
                      </option>
                    ))}
                  </Form.Select>
                  {editError.material && <span className="glass-error-badge">{editError.material}</span>}
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Stock Status</Form.Label>
                  <Form.Select
                    name="stock"
                    className="glass-input"
                    value={editFormData.stock || 'In Stock'}
                    onChange={handleEditChange}
                  >
                    <option value="In Stock" style={{ color: '#000' }}>In Stock</option>
                    <option value="Limited Stock" style={{ color: '#000' }}>Limited Stock</option>
                    <option value="Out of Stock" style={{ color: '#000' }}>Out of Stock</option>
                  </Form.Select>
                  {editError.stock && <span className="glass-error-badge">{editError.stock}</span>}
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Update Image (Optional)</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    className="glass-input"
                    onChange={handleEditFileChange}
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Label className="glass-label">Available Sizes</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((sz) => {
                    const isSel = (editFormData.selectedSizes || []).includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        className={`size-toggle-btn ${isSel ? 'selected' : ''}`}
                        onClick={() => handleEditSizeToggle(sz)}
                      >
                        {isSel ? `✓ ${sz}` : sz}
                      </button>
                    );
                  })}
                </div>
                {editError.size && <span className="glass-error-badge">{editError.size}</span>}
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="glass-label">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    className="glass-input"
                    value={editFormData.description || ''}
                    onChange={handleEditChange}
                  />
                  {editError.description && <span className="glass-error-badge">{editError.description}</span>}
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="glass-modal-footer">
            <Button className="btn-glass-secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-glass-primary" disabled={editSubmitting}>
              {editSubmitting ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered contentClassName="glass-modal">
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title style={{ fontSize: '1.25rem', fontWeight: 700 }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p>
            Are you sure you want to delete product <strong>"{deletingProduct?.prdName}"</strong>?
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            This will remove the product from listings and mark it as deleted.
          </p>
        </Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button className="btn-glass-danger" onClick={confirmDeleteProduct} disabled={deleteSubmitting}>
            {deleteSubmitting ? <Spinner animation="border" size="sm" /> : 'Delete Product'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* CLEAR ALL MY PRODUCTS MODAL */}
      <Modal show={showClearAllModal} onHide={() => setShowClearAllModal(false)} centered contentClassName="glass-modal">
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ef4444' }}>
            🗑️ Clear All My Products
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p>
            <strong>Warning:</strong> Are you sure you want to delete ALL products created by your account?
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            This operation will soft-delete all your product listings ({pagination.total} products) and clear them from active shopping carts.
          </p>
        </Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-secondary" onClick={() => setShowClearAllModal(false)}>
            Cancel
          </Button>
          <Button className="btn-glass-danger" onClick={confirmClearAll} disabled={clearAllSubmitting}>
            {clearAllSubmitting ? <Spinner animation="border" size="sm" /> : 'Yes, Delete All My Products'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SellerDashboard;
