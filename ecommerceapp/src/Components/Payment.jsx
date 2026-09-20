import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import SEO from './SEO';
import './Style.css';

const Payment = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <SEO title="Payment Gateway" noindex={true} />
      <Header />
      <Container className="py-5" style={{ maxWidth: "550px" }}>
        <div className="glass-card text-center py-5">
          <div style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.2)",
            color: "#34d399",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 1.5rem"
          }}>
            ✓
          </div>
          <h1 className="page-title" style={{ fontSize: "1.8rem" }}>Payment Successful!</h1>
          <p className="page-subtitle mb-4">
            Thank you for shopping with TrendLife. Your order has been placed and is currently being processed.
          </p>

          <div className="d-flex gap-3 justify-content-center">
            <Button className="btn-glass-secondary" onClick={() => navigate('/vieworders')}>
              View My Orders
            </Button>
            <Button className="btn-glass-primary" onClick={() => navigate('/viewproduct')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Payment;