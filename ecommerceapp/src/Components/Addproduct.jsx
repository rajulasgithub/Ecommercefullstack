import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { isEmpty, isNumeric } from '../utils/validation';
import './Style.css';

const Addproduct = () => {
  const navigate = useNavigate();
  const [addproduct, setAddproduct] = useState({});
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (event) => {
    setAddproduct({ ...addproduct, [event.target.name]: event.target.value });
    setError({ ...error, [event.target.name]: '' });
    setServerError('');
  };

  const fileChange = (event) => {
    setAddproduct({ ...addproduct, image: event.target.files[0] });
    setServerError('');
  };

  const Validate = () => {
    const errormessage = {};
    if (isEmpty(addproduct.prdName)) {
      errormessage.prdName = "Product name is required";
    }
    if (isEmpty(addproduct.category)) {
      errormessage.category = "Category is required";
    }
    if (isEmpty(addproduct.style)) {
      errormessage.style = "Style is required";
    }
    if (isEmpty(addproduct.prize)) {
      errormessage.prize = "Price must be a valid number";
    } else if (!isNumeric(addproduct.prize)) {
      errormessage.prize = "Price must be a valid number";
    }
    if (isEmpty(addproduct.stock)) {
      errormessage.stock = "Stock quantity must be a valid number";
    } else if (!isNumeric(addproduct.stock)) {
      errormessage.stock = "Stock quantity must be a valid number";
    }
    if (isEmpty(addproduct.size)) {
      errormessage.size = "Product size is required";
    }
    if (isEmpty(addproduct.material)) {
      errormessage.material = "Material is required";
    }
    if (isEmpty(addproduct.description)) {
      errormessage.description = "Product description is required";
    }

    setError(errormessage);
    return Object.keys(errormessage).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!Validate()) return;

    const formdata = new FormData();
    formdata.append('prdName', addproduct.prdName || '');
    formdata.append('category', addproduct.category || 'Women');
    formdata.append('style', addproduct.style || 'Casual Wear');
    formdata.append('description', addproduct.description || '');
    formdata.append('image', addproduct.image || '');
    formdata.append('prize', addproduct.prize || '');
    formdata.append('stock', addproduct.stock !== undefined ? addproduct.stock : 0);
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
      <Container className="py-5" style={{ maxWidth: "680px" }}>
        <div className="glass-card">
          <div className="text-center mb-4">
            <span className="status-pill processing mb-2">Inventory Management</span>
            <h2 className="page-title" style={{ fontSize: "2rem" }}>Add New Product</h2>
            <p className="page-subtitle" style={{ fontSize: "0.9rem" }}>Upload apparel listings with complete details and image</p>
          </div>

          {serverError && (
            <div className="alert alert-danger text-center mb-3" role="alert" style={{ fontSize: '0.875rem' }}>
              {serverError}
            </div>
          )}

          <Form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
            <Form.Group className="mb-3">
              <Form.Label className="glass-label">Product Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                className="glass-input"
                onChange={fileChange}
              />
            </Form.Group>

            <Row className="g-3 mb-3">
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Silk Designer Anarkali Suit"
                    name="prdName"
                    className="glass-input"
                    onChange={handleChange}
                  />
                  {error.prdName && <span className="glass-error-badge">{error.prdName}</span>}
                </Form.Group>
              </Col>

              <Col xs={12} sm={3}>
                <Form.Group>
                  <Form.Label className="glass-label">Category</Form.Label>
                  <Form.Select
                    name="category"
                    className="glass-input"
                    onChange={handleChange}
                    value={addproduct.category || ''}
                  >
                    <option value="" style={{ color: '#000' }}>Select Category</option>
                    <option value="Women" style={{ color: '#000' }}>Women</option>
                    <option value="Men" style={{ color: '#000' }}>Men</option>
                    <option value="Kids" style={{ color: '#000' }}>Kids</option>
                    <option value="Unisex" style={{ color: '#000' }}>Unisex</option>
                  </Form.Select>
                  {error.category && <span className="glass-error-badge">{error.category}</span>}
                </Form.Group>
              </Col>

              <Col xs={12} sm={3}>
                <Form.Group>
                  <Form.Label className="glass-label">Style</Form.Label>
                  <Form.Select
                    name="style"
                    className="glass-input"
                    onChange={handleChange}
                    value={addproduct.style || ''}
                  >
                    <option value="" style={{ color: '#000' }}>Select Style</option>
                    <option value="Casual Wear" style={{ color: '#000' }}>Casual Wear</option>
                    <option value="Party Wear" style={{ color: '#000' }}>Party Wear</option>
                    <option value="Ethnic Wear" style={{ color: '#000' }}>Ethnic Wear</option>
                    <option value="Formal Wear" style={{ color: '#000' }}>Formal Wear</option>
                    <option value="Wedding Wear" style={{ color: '#000' }}>Wedding Wear</option>
                    <option value="Sportswear" style={{ color: '#000' }}>Sportswear</option>
                  </Form.Select>
                  {error.style && <span className="glass-error-badge">{error.style}</span>}
                </Form.Group>
              </Col>
            </Row>

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
                  />
                  {error.prize && <span className="glass-error-badge">{error.prize}</span>}
                </Form.Group>
              </Col>

              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Stock Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="e.g. 25"
                    name="stock"
                    className="glass-input"
                    onChange={handleChange}
                  />
                  {error.stock && <span className="glass-error-badge">{error.stock}</span>}
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mb-3">
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Available Sizes</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. S, M, L, XL"
                    name="size"
                    className="glass-input"
                    onChange={handleChange}
                  />
                  {error.size && <span className="glass-error-badge">{error.size}</span>}
                </Form.Group>
              </Col>

              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label className="glass-label">Material & Fabric Info</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Pure Georgette with Embroidery"
                    name="material"
                    className="glass-input"
                    onChange={handleChange}
                  />
                  {error.material && <span className="glass-error-badge">{error.material}</span>}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="glass-label">Product Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter detailed product description, styling tips, or garment care details..."
                name="description"
                className="glass-input"
                onChange={handleChange}
              />
              {error.description && <span className="glass-error-badge">{error.description}</span>}
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