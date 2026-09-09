import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './Style.css';

const Addproduct = () => {
  const navigate = useNavigate();
  const [addproduct, setAddproduct] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (event) => {
    setAddproduct({ ...addproduct, [event.target.name]: event.target.value });
    setServerError('');
  };

  const fileChange = (event) => {
    setAddproduct({ ...addproduct, image: event.target.files[0] });
    setServerError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append('prdName', addproduct.prdName || '');
    formdata.append('image', addproduct.image || '');
    formdata.append('prize', addproduct.prize || '');
    formdata.append('size', addproduct.size || '');
    formdata.append('material', addproduct.material || '');

    try {
      const response = await api.post('/product/addproduct', formdata);
      if (response.data && response.data.success) {
        navigate('/viewproduct');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to upload product. Check your vendor permissions.';
      setServerError(msg);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <Container className="py-5" style={{ maxWidth: "650px" }}>
        <div className="glass-card">
          <div className="text-center mb-4">
            <span className="status-pill processing mb-2">Inventory Management</span>
            <h2 className="page-title" style={{ fontSize: "2rem" }}>Add New Product</h2>
            <p className="page-subtitle" style={{ fontSize: "0.9rem" }}>Upload apparel listings with details and image</p>
          </div>

          {serverError && (
            <div className="alert alert-danger text-center mb-3" role="alert" style={{ fontSize: '0.875rem' }}>
              {serverError}
            </div>
          )}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Product Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                className="glass-input"
                onChange={fileChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Silk Designer Anarkali Suit"
                name="prdName"
                className="glass-input"
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row className="g-3 mb-3">
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="e.g. 2499"
                    name="prize"
                    className="glass-input"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Size</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. M, L, XL"
                    name="size"
                    className="glass-input"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="glass-label">Material & Fabric Info</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Pure Georgette with Embroidery"
                name="material"
                className="glass-input"
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex gap-3 justify-content-end">
              <Button type="button" className="btn-glass-secondary" onClick={() => navigate('/viewproduct')}>
                Cancel
              </Button>
              <Button type="submit" className="btn-glass-primary">
                Upload Product
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default Addproduct;