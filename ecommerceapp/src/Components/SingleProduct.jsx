import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import Header from './Header';
import SEO from './SEO';
import api from '../utils/api';
import ROLES from '../utils/roles';
import { isEmpty, isNumeric, MATERIALS, STYLES } from '../utils/validation';
import './Style.css';

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem('token');
  const userLoginId = localStorage.getItem('loginId');

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

  // Product Reviews state
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const [eligibility, setEligibility] = useState({
    canReview: false,
    hasPurchased: false,
    alreadyReviewed: false,
    userReview: null,
  });

  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // Review Modals state
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [showViewReviewsModal, setShowViewReviewsModal] = useState(false);

  // Edit Review states
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRatingInput, setEditRatingInput] = useState(5);
  const [editCommentInput, setEditCommentInput] = useState("");
  const [submittingEditReview, setSubmittingEditReview] = useState(false);
  const [editReviewError, setEditReviewError] = useState("");

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await api.get(`/review/product/${id}`);
      if (response.data && response.data.success) {
        setReviews(response.data.data || []);
        setAverageRating(response.data.averageRating || 0);
        setTotalReviews(response.data.totalReviews || 0);
        setRatingDistribution(response.data.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchEligibility = async () => {
    if (!token) return;
    try {
      const response = await api.get(`/review/eligibility/${id}`);
      if (response.data && response.data.success) {
        setEligibility({
          canReview: response.data.canReview,
          hasPurchased: response.data.hasPurchased,
          alreadyReviewed: response.data.alreadyReviewed,
          userReview: response.data.userReview,
        });
      }
    } catch (err) {
      console.error("Error checking review eligibility:", err);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
    fetchEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!ratingInput || ratingInput < 1 || ratingInput > 5) {
      setReviewError("Please select a star rating between 1 and 5.");
      return;
    }
    if (!commentInput.trim()) {
      setReviewError("Please write a short comment for your review.");
      return;
    }

    setSubmittingReview(true);
    setReviewError("");

    try {
      const response = await api.post("/review/add", {
        productId: id,
        rating: ratingInput,
        comment: commentInput.trim(),
      });

      if (response.data && response.data.success) {
        toast.success(response.data.message || "🎉 Review submitted successfully!");
        setCommentInput("");
        setRatingInput(5);
        setShowAddReviewModal(false);
        fetchReviews();
        fetchEligibility();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit review. Please try again.";
      toast.error(msg);
      setReviewError(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReviewClick = (review) => {
    setEditingReviewId(review._id);
    setEditRatingInput(review.rating);
    setEditCommentInput(review.comment);
    setEditReviewError("");
    setShowEditReviewModal(true);
  };

  const handleEditReviewSubmit = async (e) => {
    e.preventDefault();
    if (!editRatingInput || editRatingInput < 1 || editRatingInput > 5) {
      setEditReviewError("Please select a star rating between 1 and 5.");
      return;
    }
    if (!editCommentInput.trim()) {
      setEditReviewError("Please write a short comment for your review.");
      return;
    }

    setSubmittingEditReview(true);
    setEditReviewError("");

    try {
      const response = await api.put(`/review/update/${editingReviewId}`, {
        rating: editRatingInput,
        comment: editCommentInput.trim(),
      });

      if (response.data && response.data.success) {
        toast.success("Review updated successfully!");
        setShowEditReviewModal(false);
        fetchReviews();
        fetchEligibility();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update review.";
      toast.error(msg);
      setEditReviewError(msg);
    } finally {
      setSubmittingEditReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const response = await api.delete(`/review/delete/${reviewId}`);
      if (response.data && response.data.success) {
        toast.success("Review deleted successfully!");
        fetchReviews();
        fetchEligibility();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review.");
    }
  };

  const fetchProductDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/product/viewone/${id}`);
      if (response.data && response.data.data) {
        const prod = response.data.data;
        if (prod.status === 'deleted' && role !== ROLES.COMPANY && role !== ROLES.ADMIN) {
          setError('This product has been removed and is no longer available.');
          setProduct(null);
        } else {
          setProduct(prod);
        }
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
        toast.success('✨ Item added to your shopping bag!');
        setSuccessMsg('✨ Item added to your shopping bag!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add item to cart.';
      toast.error(msg);
      setError(msg);
    } finally {
      setAddingToCart(false);
    }
  };

  const [addingToWishlist, setAddingToWishlist] = useState(false);

  const handleAddToWishlist = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setAddingToWishlist(true);
    setSuccessMsg('');
    setError('');

    try {
      const response = await api.post('/wishlist/add', { productId: id });
      if (response.data && response.data.success) {
        toast.success('❤️ Item added to your wishlist!');
        setSuccessMsg('❤️ Item added to your wishlist!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add item to wishlist.';
      toast.error(msg);
      setError(msg);
    } finally {
      setAddingToWishlist(false);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);

  const handleDeleteProduct = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteProduct = async () => {
    setDeletingProduct(true);
    try {
      await api.put(`/product/deleteproduct/${id}`);
      toast.success('🗑️ Product deleted successfully!');
      setShowDeleteModal(false);
      navigate('/viewproduct');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete product.';
      toast.error(msg);
      setError(msg);
      setShowDeleteModal(false);
    } finally {
      setDeletingProduct(false);
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
    const sizeStr = updated.join(', ');
    setUpdateData({
      ...updateData,
      selectedSizes: updated,
      size: sizeStr
    });
    if (sizeStr.trim()) {
      setEditErrors({ ...editErrors, size: '' });
    } else {
      setEditErrors({ ...editErrors, size: 'At least one size must be selected' });
    }
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
    if (isEmpty(priceVal)) {
      errs.prize = "Price is required";
    } else if (!isNumeric(priceVal) || Number(priceVal) <= 0) {
      errs.prize = "Price must be a positive number greater than 0";
    }
    if (isEmpty(stockVal)) errs.stock = "Stock status is required";
    if (isEmpty(sizeVal) || (updateData.selectedSizes && updateData.selectedSizes.length === 0)) {
      errs.size = "At least one size must be selected";
    }
    if (isEmpty(matVal)) errs.material = "Material is required";
    if (isEmpty(descVal)) {
      errs.description = "Product description is required";
    } else if (descVal.trim().length < 10 || descVal.trim().length > 1000) {
      errs.description = "Description must be between 10 and 1000 characters";
    }

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
      toast.success('✨ Product updated successfully!');
      setShowEdit(false);
      setEditErrors({});
      fetchProductDetails();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update product details.';
      toast.error(msg);
      setError(msg);
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

  const productStructuredData = product ? {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    'name': product.prdName,
    'image': images,
    'description': product.description || `Handcrafted with premium ${product.material || ''} fabric tailored for elegant fit and lasting durability.`,
    'category': product.category || 'Apparel',
    'offers': {
      '@type': 'Offer',
      'url': window.location.href,
      'priceCurrency': 'INR',
      'price': product.prize,
      'availability': product.stock !== 'Out of Stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      'seller': {
        '@type': 'Organization',
        'name': 'TrendLife'
      }
    },
    ...(totalReviews > 0 ? {
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': averageRating,
        'reviewCount': totalReviews
      }
    } : {})
  } : null;

  return (
    <div className="page-container">
      <SEO
        title={`${product.prdName} - Buy Online`}
        description={product.description || `Buy ${product.prdName} (${product.category || 'Women'}, ${product.style || 'Casual Wear'}) online at ₹${product.prize} on TrendLife. Free delivery & 30-day returns.`}
        keywords={`trendlife, ${product.prdName}, ${product.category || ''}, ${product.style || ''}, ${product.material || ''}, buy fashion online`}
        ogImage={images[0]}
        ogType="product"
        structuredData={productStructuredData}
      />
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
                    objectFit: 'contain',
                    objectPosition: 'center',
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

                  <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem', lineHeight: 1.2 }}>
                    {product.prdName}
                  </h1>

                  {/* Rating summary badge */}
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="d-flex align-items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          style={{
                            color: star <= Math.round(averageRating) ? "#f59e0b" : "#4b5563",
                            fontSize: "1.1rem",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-light fw-bold" style={{ fontSize: "0.9rem" }}>
                      {averageRating > 0 ? averageRating : "No ratings yet"}
                    </span>
                    {totalReviews > 0 && (
                      <span className="text-secondary" style={{ fontSize: "0.85rem" }}>
                        ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                      </span>
                    )}
                  </div>

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

                {/* Role & Ownership Specific Action Buttons */}
                <div>
                  {(() => {
                    const userLoginId = localStorage.getItem("loginId");
                    const prodOwnerId = product?.loginId?._id || product?.loginId;
                    const isOwner = Boolean(
                      userLoginId &&
                      prodOwnerId &&
                      String(prodOwnerId) === String(userLoginId)
                    );
                    const canManage = isOwner || role === ROLES.ADMIN;

                    if (canManage) {
                      return (
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
                      );
                    }

                    return (
                      <div className="d-grid gap-2">
                        {product.status !== 'deleted' && product.stock !== 'Out of Stock' ? (
                          <div className="d-flex gap-2">
                            <Button
                              className="btn-glass-primary flex-grow-1 py-3"
                              style={{ fontSize: '1.1rem', fontWeight: 700 }}
                              disabled={addingToCart}
                              onClick={handleAddToCart}
                            >
                              {addingToCart ? 'Adding to Bag...' : '🛍️ Add to Shopping Bag'}
                            </Button>
                            <Button
                              className="btn-glass-secondary py-3 px-4"
                              title="Add to Wishlist"
                              disabled={addingToWishlist}
                              onClick={handleAddToWishlist}
                            >
                              {addingToWishlist ? '...' : '❤️'}
                            </Button>
                          </div>
                        ) : (
                          <div className="d-flex gap-2">
                            <Button className="btn-glass-secondary flex-grow-1 py-3" disabled style={{ opacity: 0.6 }}>
                              Currently Out of Stock
                            </Button>
                            <Button
                              className="btn-glass-secondary py-3 px-4"
                              title="Add to Wishlist"
                              disabled={addingToWishlist}
                              onClick={handleAddToWishlist}
                            >
                              {addingToWishlist ? '...' : '❤️'}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Customer Reviews & Rating Section */}
        <div className="glass-card p-4 p-md-5 mt-4">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 pb-3 border-bottom border-secondary gap-3">
            <div>
              <h3 className="text-light fw-bold mb-1" style={{ fontSize: "1.5rem" }}>⭐ Customer Reviews & Ratings</h3>
              <p className="text-secondary mb-0" style={{ fontSize: "0.875rem" }}>
                Authentic feedback from verified purchasers of this product
              </p>
            </div>
            {totalReviews > 0 && (
              <div className="d-flex align-items-center gap-3 bg-dark px-3 py-2 rounded-3 border border-secondary">
                <span className="fs-2 fw-bold text-warning">{averageRating}</span>
                <div>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          color: star <= Math.round(averageRating) ? "#f59e0b" : "#4b5563",
                          fontSize: "1.1rem",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-secondary" style={{ fontSize: "0.8rem" }}>
                    {totalReviews} verified {totalReviews === 1 ? "review" : "reviews"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Row className="g-4">
            {/* Left Column: Rating Breakdown & Review Action */}
            <Col xs={12} lg={5}>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  padding: "1.25rem",
                }}
              >
                <h5 className="text-light fw-bold mb-3" style={{ fontSize: "1.05rem" }}>Rating Distribution</h5>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingDistribution[stars] || 0;
                  const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                  return (
                    <div key={stars} className="d-flex align-items-center gap-2 mb-2">
                      <span className="text-secondary" style={{ width: "45px", fontSize: "0.85rem" }}>
                        {stars} ★
                      </span>
                      <div
                        className="flex-grow-1"
                        style={{
                          height: "8px",
                          background: "rgba(255, 255, 255, 0.1)",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: "100%",
                            background: "#f59e0b",
                            borderRadius: "4px",
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                      <span className="text-secondary" style={{ width: "35px", fontSize: "0.8rem", textAlign: "right" }}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Review Submission Form / Status Badge */}
              <div className="mt-4">
                {token ? (
                  eligibility.canReview ? (
                    <div
                      style={{
                        background: "rgba(99, 102, 241, 0.08)",
                        border: "1px solid rgba(99, 102, 241, 0.3)",
                        borderRadius: "16px",
                        padding: "1.25rem",
                      }}
                    >
                      <h5 className="text-light fw-bold mb-1" style={{ fontSize: "1.05rem" }}>✍️ Write a Review</h5>
                      <p className="text-secondary mb-3" style={{ fontSize: "0.85rem" }}>
                        You purchased this item! Share your feedback with other buyers.
                      </p>

                      {reviewError && (
                        <div className="alert alert-danger py-2 mb-3" style={{ fontSize: "0.85rem" }}>
                          {reviewError}
                        </div>
                      )}

                      <Form onSubmit={handleReviewSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label className="glass-label">Select Rating</Form.Label>
                          <div className="d-flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRatingInput(star)}
                                style={{
                                  background: ratingInput >= star ? "rgba(245, 158, 11, 0.2)" : "rgba(255, 255, 255, 0.05)",
                                  border: ratingInput >= star ? "1px solid #f59e0b" : "1px solid rgba(255, 255, 255, 0.1)",
                                  color: ratingInput >= star ? "#f59e0b" : "#9ca3af",
                                  borderRadius: "8px",
                                  padding: "0.4rem 0.75rem",
                                  fontSize: "1.1rem",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                {star} ★
                              </button>
                            ))}
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="glass-label">Review Details</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Write your thoughts about quality, fit, or design..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            className="glass-input"
                          />
                        </Form.Group>

                        <Button
                          type="submit"
                          className="btn-glass-primary w-100 py-2"
                          disabled={submittingReview}
                        >
                          {submittingReview ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" className="me-2" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Review"
                          )}
                        </Button>
                      </Form>
                    </div>
                  ) : eligibility.alreadyReviewed ? (
                    <div
                      style={{
                        background: "rgba(16, 185, 129, 0.08)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        borderRadius: "16px",
                        padding: "1.25rem",
                      }}
                    >
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="status-pill delivered">✓ Reviewed</span>
                        <span className="text-light fw-bold" style={{ fontSize: "0.9rem" }}>
                          Review Submitted
                        </span>
                      </div>
                      {eligibility.userReview && (
                        <div className="mt-2 text-secondary" style={{ fontSize: "0.85rem" }}>
                          <div>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span key={s} style={{ color: s <= eligibility.userReview.rating ? "#f59e0b" : "#4b5563" }}>
                                ★
                              </span>
                            ))}
                          </div>
                          <p className="text-light mt-1 mb-0" style={{ fontStyle: "italic" }}>
                            "{eligibility.userReview.comment}"
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "16px",
                        padding: "1.25rem",
                      }}
                    >
                      <span className="text-secondary d-block mb-1" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                        🔒 Verified Buyers Only
                      </span>
                      <p className="text-light mb-0" style={{ fontSize: "0.85rem" }}>
                        Only customers who have purchased this item can leave a review.
                      </p>
                    </div>
                  )
                ) : (
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "16px",
                      padding: "1.25rem",
                      textAlign: "center",
                    }}
                  >
                    <p className="text-secondary mb-3" style={{ fontSize: "0.85rem" }}>
                      Purchased this item? Sign in to submit your review.
                    </p>
                    <Button
                      className="btn-glass-secondary py-1 px-4"
                      onClick={() => navigate("/login")}
                    >
                      Sign In to Review
                    </Button>
                  </div>
                )}
              </div>
            </Col>

            {/* Right Column: Customer Reviews List ("View Reviews") */}
            <Col xs={12} lg={7}>
              {reviewsLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="light" size="sm" />
                  <p className="text-secondary mt-2" style={{ fontSize: "0.85rem" }}>
                    Loading reviews...
                  </p>
                </div>
              ) : reviews.length === 0 ? (
                <div
                  className="text-center py-5"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px dashed rgba(255, 255, 255, 0.1)",
                    borderRadius: "16px",
                  }}
                >
                  <span style={{ fontSize: "2.5rem" }}>💬</span>
                  <h5 className="text-light fw-bold mt-2">No Reviews Yet</h5>
                  <p className="text-secondary mb-0" style={{ fontSize: "0.85rem" }}>
                    Be the first verified purchaser to leave a review for this item!
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {reviews.map((rev) => (
                    <div
                      key={rev._id}
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "16px",
                        padding: "1.25rem",
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "50%",
                              overflow: "hidden",
                              background: "rgba(99, 102, 241, 0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              color: "#a5b4fc",
                            }}
                          >
                            {rev.user?.image ? (
                              <img
                                src={rev.user.image}
                                alt="User Avatar"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => (e.target.style.display = "none")}
                              />
                            ) : (
                              (rev.user?.firstName?.[0] || "U").toUpperCase()
                            )}
                          </div>
                          <div>
                            <span className="text-light fw-bold d-block" style={{ fontSize: "0.95rem" }}>
                              {rev.user?.firstName} {rev.user?.lastName}
                            </span>
                            <span
                              className="status-pill active px-2 py-0"
                              style={{ fontSize: "0.7rem", display: "inline-block" }}
                            >
                              ✓ Verified Buyer
                            </span>
                          </div>
                        </div>

                        <div className="text-end">
                          <div>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                style={{
                                  color: star <= rev.rating ? "#f59e0b" : "#4b5563",
                                  fontSize: "1rem",
                                }}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-secondary d-block" style={{ fontSize: "0.75rem" }}>
                            {new Date(rev.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          {String(rev.loginId) === String(userLoginId) && (
                            <div className="d-flex gap-2 justify-content-end mt-1">
                              <Button
                                variant="link"
                                className="p-0 text-info"
                                style={{ fontSize: "0.8rem", textDecoration: "none" }}
                                onClick={() => handleEditReviewClick(rev)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="link"
                                className="p-0 text-danger"
                                style={{ fontSize: "0.8rem", textDecoration: "none" }}
                                onClick={() => handleDeleteReview(rev._id)}
                              >
                                Delete
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-light mb-0 mt-2" style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
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
                    <option value="" style={{ color: '#000' }}>Select Style</option>
                    {STYLES.map((st) => (
                      <option key={st} value={st} style={{ color: '#000' }}>
                        {st}
                      </option>
                    ))}
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
                  <Form.Select
                    name="material"
                    defaultValue={product.material || ''}
                    className="glass-input"
                    onChange={handleEditChange}
                  >
                    <option value="" style={{ color: '#000' }}>Select Material</option>
                    {MATERIALS.map((mat) => (
                      <option key={mat} value={mat} style={{ color: '#000' }}>
                        {mat}
                      </option>
                    ))}
                  </Form.Select>
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered contentClassName="glass-modal">
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title style={{ color: '#ffffff', fontWeight: 700 }}>Confirm Product Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h5 style={{ color: '#ffffff', fontWeight: 600, marginBottom: '0.5rem' }}>
            Are you sure you want to delete this product listing?
          </h5>
          <p style={{ color: '#a5b4fc', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            "{product?.prdName}"
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
            This will soft-delete the item and return you to the catalog.
          </p>
        </Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-secondary" onClick={() => setShowDeleteModal(false)} disabled={deletingProduct}>
            Cancel
          </Button>
          <Button className="btn-glass-danger" onClick={confirmDeleteProduct} disabled={deletingProduct}>
            {deletingProduct ? (
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

      {/* Add Review Modal */}
      <Modal show={showAddReviewModal} onHide={() => setShowAddReviewModal(false)} centered contentClassName="glass-modal">
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title style={{ color: "#ffffff", fontWeight: 700 }}>✍️ Submit Product Review</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="text-secondary mb-3" style={{ fontSize: "0.9rem" }}>
            Reviewing <strong className="text-light">{product?.prdName}</strong>
          </p>

          {reviewError && (
            <div className="alert alert-danger py-2 mb-3" style={{ fontSize: "0.85rem" }}>
              {reviewError}
            </div>
          )}

          <Form onSubmit={handleReviewSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="glass-label">Select Rating</Form.Label>
              <div className="d-flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingInput(star)}
                    style={{
                      background: ratingInput >= star ? "rgba(245, 158, 11, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      border: ratingInput >= star ? "1px solid #f59e0b" : "1px solid rgba(255, 255, 255, 0.1)",
                      color: ratingInput >= star ? "#f59e0b" : "#9ca3af",
                      borderRadius: "8px",
                      padding: "0.4rem 0.8rem",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {star} ★
                  </button>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="glass-label">Review Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Share your experience regarding fabric quality, fit, and design..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="glass-input"
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-light"
                onClick={() => setShowAddReviewModal(false)}
                disabled={submittingReview}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn-glass-primary px-4"
                disabled={submittingReview}
              >
                {submittingReview ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Review Modal */}
      <Modal show={showEditReviewModal} onHide={() => setShowEditReviewModal(false)} centered contentClassName="glass-modal">
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title style={{ color: "#ffffff", fontWeight: 700 }}>✏️ Edit Review</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {editReviewError && (
            <div className="alert alert-danger py-2 mb-3" style={{ fontSize: "0.85rem" }}>
              {editReviewError}
            </div>
          )}

          <Form onSubmit={handleEditReviewSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="glass-label">Update Rating</Form.Label>
              <div className="d-flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditRatingInput(star)}
                    style={{
                      background: editRatingInput >= star ? "rgba(245, 158, 11, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      border: editRatingInput >= star ? "1px solid #f59e0b" : "1px solid rgba(255, 255, 255, 0.1)",
                      color: editRatingInput >= star ? "#f59e0b" : "#9ca3af",
                      borderRadius: "8px",
                      padding: "0.4rem 0.8rem",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {star} ★
                  </button>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="glass-label">Review Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={editCommentInput}
                onChange={(e) => setEditCommentInput(e.target.value)}
                className="glass-input"
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-light"
                onClick={() => setShowEditReviewModal(false)}
                disabled={submittingEditReview}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn-glass-primary px-4"
                disabled={submittingEditReview}
              >
                {submittingEditReview ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Updating...
                  </>
                ) : (
                  "Update Review"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* View Reviews Modal */}
      <Modal show={showViewReviewsModal} onHide={() => setShowViewReviewsModal(false)} size="lg" centered contentClassName="glass-modal">
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title style={{ color: "#ffffff", fontWeight: 700 }}>
            ⭐ Customer Reviews ({totalReviews})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-secondary gap-3">
            <div>
              <h5 className="text-light fw-bold mb-1">{product?.prdName}</h5>
              <span className="text-secondary" style={{ fontSize: "0.85rem" }}>
                {totalReviews > 0 ? `${averageRating} out of 5 stars` : "No ratings submitted yet"}
              </span>
            </div>
            {totalReviews > 0 && (
              <div className="d-flex align-items-center gap-2 bg-dark px-3 py-2 rounded-3 border border-secondary">
                <span className="fs-3 fw-bold text-warning">{averageRating}</span>
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        color: star <= Math.round(averageRating) ? "#f59e0b" : "#4b5563",
                        fontSize: "1rem",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {reviewsLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="light" size="sm" />
              <p className="text-secondary mt-2" style={{ fontSize: "0.85rem" }}>
                Loading customer reviews...
              </p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-4">
              <span style={{ fontSize: "2.5rem" }}>💬</span>
              <h5 className="text-light fw-bold mt-2">No Reviews Yet</h5>
              <p className="text-secondary mb-0" style={{ fontSize: "0.85rem" }}>
                Be the first verified purchaser to review this item!
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3" style={{ maxHeight: "450px", overflowY: "auto" }}>
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "14px",
                    padding: "1rem 1.25rem",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          background: "rgba(99, 102, 241, 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          color: "#a5b4fc",
                        }}
                      >
                        {rev.user?.image ? (
                          <img
                            src={rev.user.image}
                            alt="User Avatar"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        ) : (
                          (rev.user?.firstName?.[0] || "U").toUpperCase()
                        )}
                      </div>
                      <div>
                        <span className="text-light fw-bold d-block" style={{ fontSize: "0.9rem" }}>
                          {rev.user?.firstName} {rev.user?.lastName}
                        </span>
                        <span
                          className="status-pill active px-2 py-0"
                          style={{ fontSize: "0.65rem", display: "inline-block" }}
                        >
                          ✓ Verified Buyer
                        </span>
                      </div>
                    </div>

                    <div className="text-end">
                      <div>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              color: star <= rev.rating ? "#f59e0b" : "#4b5563",
                              fontSize: "0.9rem",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-secondary d-block" style={{ fontSize: "0.75rem" }}>
                        {new Date(rev.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {String(rev.loginId) === String(userLoginId) && (
                        <div className="d-flex gap-2 justify-content-end mt-1">
                          <Button
                            variant="link"
                            className="p-0 text-info"
                            style={{ fontSize: "0.8rem", textDecoration: "none" }}
                            onClick={() => {
                              setShowViewReviewsModal(false);
                              handleEditReviewClick(rev);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="link"
                            className="p-0 text-danger"
                            style={{ fontSize: "0.8rem", textDecoration: "none" }}
                            onClick={() => {
                              setShowViewReviewsModal(false);
                              handleDeleteReview(rev._id);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-light mb-0 mt-1" style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="glass-modal-footer">
          <Button className="btn-glass-secondary" onClick={() => setShowViewReviewsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SingleProduct;
