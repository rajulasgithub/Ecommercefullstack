import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import Header from './Header';
import api from '../utils/api';
import './Style.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [token, navigate]);

  const fetchWishlist = () => {
    setLoading(true);
    api.get('/wishlist/view')
      .then((response) => {
        setWishlist(response.data.data || []);
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg('Failed to load your wishlist.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const removeFromWishlist = (id) => {
    api.delete(`/wishlist/remove/${id}`)
      .then(() => {
        toast.success("🗑️ Removed from wishlist!");
        setWishlist(wishlist.filter(item => item._id !== id));
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Failed to remove item.";
        toast.error(msg);
      });
  };

  const handleAddToCart = (productId, wishlistItemId) => {
    api.post('/cart/addtocart', { productId })
      .then(() => {
        toast.success("🛍️ Added to shopping bag!");
        // Optionally remove from wishlist after adding to cart
        removeFromWishlist(wishlistItemId);
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Failed to add to cart.";
        toast.error(msg);
      });
  };

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

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <Container className="py-5 text-center">
          <div className="glass-card py-5 style-loader" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <Spinner animation="border" style={{ color: '#a5b4fc', width: '3rem', height: '3rem' }} />
            <h4 className="mt-3" style={{ color: '#ffffff', fontWeight: 600 }}>Loading Wishlist...</h4>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <Container className="py-4">
        <div className="page-header mb-4">
          <span className="status-pill processing mb-2">My Favorites</span>
          <h1 className="page-title">Your Wishlist</h1>
          <p className="page-subtitle">Saved items you want to buy later</p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger text-center mb-4" role="alert">
            {errorMsg}
          </div>
        )}

        {wishlist.length === 0 ? (
          <div className="glass-card text-center py-5" style={{ maxWidth: '550px', margin: '0 auto' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>❤️</div>
            <h3 className="page-title" style={{ fontSize: '1.5rem' }}>Your wishlist is empty</h3>
            <p className="page-subtitle mb-4">Explore our catalog and save items you love!</p>
            <Button className="btn-glass-primary" onClick={() => navigate('/viewproduct')}>
              Discover Products →
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {wishlist.map((item) => {
              if (!item.prdId) return null;
              const product = item.prdId;
              const images = parseImages(product.image);

              return (
                <Col xs={12} sm={6} md={4} lg={3} key={item._id}>
                  <div className="glass-card h-100 d-flex flex-column justify-content-between p-3">
                    <div>
                      <div
                        onClick={() => navigate(`/product/${product._id}`)}
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
                          src={images[0]}
                          alt={product.prdName}
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
                        {product.stock !== 'Out of Stock' ? (
                          <span className="status-pill delivered" style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.75rem' }}>
                            {product.stock || 'In Stock'}
                          </span>
                        ) : (
                          <span className="status-pill out-of-stock" style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.75rem' }}>
                            Out of Stock
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => navigate(`/product/${product._id}`)}
                        style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.4rem", cursor: "pointer" }}
                      >
                        {product.prdName}
                      </h3>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#a5b4fc" }}>
                          ₹{product.prize}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex flex-column gap-2">
                      {product.stock !== 'Out of Stock' ? (
                        <Button
                          className="btn-glass-primary w-100"
                          size="sm"
                          onClick={() => handleAddToCart(product._id, item._id)}
                        >
                          🛍️ Move to Bag
                        </Button>
                      ) : (
                        <Button className="btn-glass-secondary w-100" size="sm" disabled>
                          Out of Stock
                        </Button>
                      )}
                      <Button
                        className="btn-glass-danger w-100"
                        size="sm"
                        onClick={() => removeFromWishlist(item._id)}
                      >
                        🗑️ Remove
                      </Button>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Wishlist;
