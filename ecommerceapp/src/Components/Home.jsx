import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './Home.css';

const categories = [
  { id: 1, title: 'Ethnic Wears', tag: 'Traditional & Fusion', img: '/images/ethnic.jpg' },
  { id: 2, title: 'Party Wears', tag: 'Glamorous & Evening', img: '/images/partywear.jpg' },
  { id: 3, title: 'Casual Wears', tag: 'Everyday Comfort', img: '/images/casualwears.jpg' },
  { id: 4, title: 'Elegant Gowns', tag: 'Red Carpet Ready', img: '/images/gowns.jpg' },
  { id: 5, title: 'Kids Collection', tag: 'Cute & Vibrant', img: '/images/kidswear.jpg' },
  { id: 6, title: 'Menswear', tag: 'Smart & Tailored', img: '/images/menswear.jpg' },
];

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
        <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
      </svg>
    ),
    title: 'Free Express Delivery',
    desc: 'On all orders above ₹999 across India'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
      </svg>
    ),
    title: '100% Secure Checkout',
    desc: 'Encrypted payments via UPI & Cards'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
        <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z"/>
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
      </svg>
    ),
    title: 'Easy 30-Day Returns',
    desc: 'Money-back guarantee policy'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
        <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
      </svg>
    ),
    title: '24/7 Priority Support',
    desc: 'Dedicated customer assistance'
  }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay-glow"></div>
        <div className="hero-content">
          <div className="hero-badge">✨ NEW COLLECTION 2026</div>
          <h1 className="hero-title">
            Discover Your Perfect Style for Every Occasion
          </h1>
          <p className="hero-subtitle">
            From elegant evening gowns to breezy casual styles, explore our handpicked fashion collection designed to celebrate your unique individuality.
          </p>
          <div className="hero-actions">
            <Button
              className="btn-hero-primary"
              onClick={() => navigate('/viewproduct')}
            >
              Shop Collection
            </Button>
            <Button
              className="btn-hero-secondary"
              onClick={() => navigate('/viewproduct')}
            >
              Explore New Arrivals
            </Button>
          </div>
        </div>
      </section>

      {/* Category Showcase Section */}
      <section className="categories-section">
        <Container>
          <div className="section-header">
            <span className="section-tag">Curated Selections</span>
            <h2 className="section-title">Find Your Unique Style</h2>
            <p className="section-desc">Browse through our meticulously crafted apparel categories</p>
          </div>

          <Row className="g-4">
            {categories.map((cat) => (
              <Col key={cat.id} xs={12} sm={6} md={4} lg={4}>
                <div className="category-card" onClick={() => navigate('/viewproduct')}>
                  <div className="category-img-wrapper">
                    <img src={cat.img} alt={cat.title} className="category-img" />
                  </div>
                  <div className="category-overlay">
                    <h3 className="category-title">{cat.title}</h3>
                    <span className="category-sub">{cat.tag} →</span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Banner Section */}
      <section className="features-section">
        <Container>
          <Row className="g-3">
            {features.map((feat, index) => (
              <Col key={index} xs={12} sm={6} lg={3}>
                <div className="feature-box">
                  <div className="feature-icon-wrapper">{feat.icon}</div>
                  <div>
                    <h4 className="feature-title">{feat.title}</h4>
                    <p className="feature-desc">{feat.desc}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Why Choose Us & Reviews */}
      <section className="reviews-section">
        <Container>
          <div className="section-header">
            <span className="section-tag">The TrendLife Experience</span>
            <h2 className="section-title">Why Fashion Enthusiasts Choose Us</h2>
            <p className="section-desc">Uncompromising quality, premium fabrics, and customer delight</p>
          </div>

          <Row className="g-4">
            <Col xs={12} md={4}>
              <div className="info-card">
                <div>
                  <div className="stars">★★★★★</div>
                  <h3 className="category-title mb-3">Premium Quality & Craftsmanship</h3>
                  <p className="quote-text">
                    "Our passion is crafting garments that make you look and feel your absolute best. High-quality fabrics and timeless designs tailored to flatter every shape."
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} md={4}>
              <div className="info-card">
                <div>
                  <div className="stars">★★★★★</div>
                  <h3 className="category-title mb-3">Trending Seasonal Must-Haves</h3>
                  <p className="quote-text">
                    "Explore our top-selling customer favorites and contemporary styles designed to keep your wardrobe fresh, elegant, and effortlessly stylish."
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={12} md={4}>
              <div className="info-card">
                <div className="info-card-header">
                  <div className="avatar-badge">AK</div>
                  <div>
                    <h4 className="category-title mb-0" style={{ fontSize: '1.05rem' }}>Ananya K.</h4>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Verified Buyer</span>
                  </div>
                </div>
                <div>
                  <div className="stars">★★★★★</div>
                  <p className="quote-text">
                    "I felt incredible in my party dress! The fit, stitch quality, and delivery speed were unbeatable. I keep coming back for every occasion!"
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Modern Footer */}
      <footer className="footer-section">
        <Container>
          <Row className="g-4">
            <Col xs={12} lg={4}>
              <span className="footer-brand">TrendLife</span>
              <p className="footer-text">
                Your premier destination for trendsetting fashion, premium ethnic wear, and modern clothing designed for every occasion.
              </p>
              <div className="social-icons">
                <a href="#whatsapp" className="social-icon-btn" aria-label="WhatsApp">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326z"/>
                  </svg>
                </a>
                <a href="#facebook" className="social-icon-btn" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                  </svg>
                </a>
                <a href="#instagram" className="social-icon-btn" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                  </svg>
                </a>
              </div>
            </Col>

            <Col xs={6} md={3} lg={2}>
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="/viewproduct">All Collections</a></li>
                <li><a href="/login">Account Login</a></li>
                <li><a href="/signup">Create Account</a></li>
                <li><a href="/cart">Shopping Bag</a></li>
              </ul>
            </Col>

            <Col xs={6} md={3} lg={2}>
              <h4 className="footer-heading">Categories</h4>
              <ul className="footer-links">
                <li><a href="/viewproduct">Ethnic Wears</a></li>
                <li><a href="/viewproduct">Party Wears</a></li>
                <li><a href="/viewproduct">Casual Wear</a></li>
                <li><a href="/viewproduct">Kids & Mens</a></li>
              </ul>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <h4 className="footer-heading">Customer Care</h4>
              <p className="footer-text mb-2">Have questions? Reach out to our 24/7 dedicated support team.</p>
              <p className="footer-text" style={{ color: '#a5b4fc', fontWeight: 600 }}>support@trendlife.com</p>
            </Col>
          </Row>

          <div className="footer-bottom">
            <p className="mb-0">© {new Date().getFullYear()} TrendLife E-Commerce. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Home;