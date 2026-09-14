import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Header from './Header';
import './Style.css';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Container className="d-flex flex-grow-1 align-items-center justify-content-center py-5 mt-4">
        <div className="glass-card text-center" style={{ maxWidth: '600px', width: '100%', padding: '4rem 2rem' }}>
          
          <div className="success-icon-container">
            <svg className="success-check-svg" viewBox="0 0 24 24">
              <path d="M4 12l4 4L20 6" />
            </svg>
          </div>

          <h1 className="page-title animate-fade-up-1" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Order Confirmed!
          </h1>
          
          <p className="page-subtitle animate-fade-up-1" style={{ marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Thank you for your purchase. We've received your order and our team is getting it ready for shipment. You will receive an email confirmation shortly.
          </p>

          <div className="d-flex gap-3 justify-content-center animate-fade-up-2">
            <Button className="btn-glass-secondary px-4 py-3" onClick={() => navigate('/viewproduct')}>
              Continue Shopping
            </Button>
            <Button className="btn-glass-primary px-4 py-3" onClick={() => navigate('/vieworders')}>
              View My Orders
            </Button>
          </div>
          
        </div>
      </Container>
    </div>
  );
};

export default OrderSuccess;
