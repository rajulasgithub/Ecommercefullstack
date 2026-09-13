import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from './Header';
import { isEmpty, isNumeric, MATERIALS, STYLES } from '../utils/validation';
import './Style.css';

const Addproduct = ({ hideHeader = false, onSuccess }) => {
  const navigate = useNavigate();
  const [addproduct, setAddproduct] = useState({});
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setAddproduct({ ...addproduct, [event.target.name]: event.target.value });
    setError({ ...error, [event.target.name]: '' });
    setServerError('');
  };

  const fileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 0) {
      setAddproduct({ ...addproduct, imageFiles: selectedFiles, image: selectedFiles[0] });
      setError({ ...error, image: '' });
    } else {
      setAddproduct({ ...addproduct, imageFiles: [], image: null });
    }
    setServerError('');
  };

  const handleSizeToggle = (sz) => {
    const current = addproduct.selectedSizes || [];
    const updated = current.includes(sz) ? current.filter(s => s !== sz) : [...current, sz];
    const sizeStr = updated.join(', ');
    setAddproduct({
      ...addproduct,
      selectedSizes: updated,
      size: sizeStr
    });
    if (sizeStr.trim()) {
      setError({ ...error, size: '' });
    } else {
      setError({ ...error, size: 'At least one size must be selected' });
    }
    setServerError('');
  };

  const Validate = () => {
    const errormessage = {};
    if ((!addproduct.imageFiles || addproduct.imageFiles.length === 0) && !addproduct.image) {
      errormessage.image = "Image is required";
    }
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
      errormessage.prize = "Price is required";
    } else if (!isNumeric(addproduct.prize) || Number(addproduct.prize) <= 0) {
      errormessage.prize = "Price must be a positive number greater than 0";
    }
    if (isEmpty(addproduct.stock)) {
      errormessage.stock = "Stock status is required";
    }
    if (isEmpty(addproduct.size) || (addproduct.selectedSizes && addproduct.selectedSizes.length === 0)) {
      errormessage.size = "At least one size must be selected";
    }
    if (isEmpty(addproduct.material)) {
      errormessage.material = "Material is required";
    }
    if (isEmpty(addproduct.description)) {
      errormessage.description = "Product description is required";
    } else if (addproduct.description.trim().length < 10 || addproduct.description.trim().length > 1000) {
      errormessage.description = "Description must be between 10 and 1000 characters";
    }

    setError(errormessage);
    return Object.keys(errormessage).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!Validate()) {
      toast.error("Please resolve the validation errors before submitting.");
      return;
    }
    setSubmitting(true);
    const formdata = new FormData();
    formdata.append('prdName', addproduct.prdName || '');
    formdata.append('category', addproduct.category || 'Women');
    formdata.append('style', addproduct.style || 'Casual Wear');
    formdata.append('description', addproduct.description || '');

    if (addproduct.imageFiles && addproduct.imageFiles.length > 0) {
      addproduct.imageFiles.forEach((file) => {
        formdata.append('image', file);
      });
    } else if (addproduct.image) {
      formdata.append('image', addproduct.image);
    }

    formdata.append('prize', addproduct.prize || '');
    formdata.append('stock', addproduct.stock || 'In Stock');
    formdata.append('size', addproduct.size || '');
    formdata.append('material', addproduct.material || '');

    try {
      const response = await api.post('/product/addproduct', formdata);
      if (response.data && response.data.success) {
        toast.success("✨ Product added successfully!");
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/sellerdashboard');
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to upload product. Check your vendor permissions.';
      toast.error(msg);
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const formContent = (
    <Container className={hideHeader ? "py-2" : "py-5"} style={{ maxWidth: "680px" }}>
      <div className="glass-card">
        <div className="text-center mb-4">
          <span className="status-pill processing mb-2">Inventory Management</span>
          <h2 className="page-title" style={{ fontSize: "2rem" }}>Add New Product</h2>
          <p className="page-subtitle" style={{ fontSize: "0.9rem" }}>Upload apparel listings with complete details and image</p>
        </div>

        {serverError && (
          <div className="alert alert-danger text-center mb-3" role="alert" style={{ fontSize: "0.875rem" }}>
            {serverError}
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="g-3 mb-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="glass-label">Product Images (Upload up to 5 images)</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  multiple
                  accept="image/*"
                  className="glass-input"
                  onChange={fileChange}
                />
                {error.image && <span className="glass-error-badge">{error.image}</span>}
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group>
                <Form.Label className="glass-label">Product Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Designer Linen Blazer"
                  name="prdName"
                  className="glass-input"
                  onChange={handleChange}
                  value={addproduct.prdName || ''}
                />
                {error.prdName && <span className="glass-error-badge">{error.prdName}</span>}
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-3 mb-3">
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="glass-label">Target Category</Form.Label>
                <Form.Select
                  name="category"
                  className="glass-input"
                  onChange={handleChange}
                  value={addproduct.category || 'Women'}
                >
                  <option value="Men" style={{ color: '#000' }}>Men</option>
                  <option value="Women" style={{ color: '#000' }}>Women</option>
                  <option value="Kids" style={{ color: '#000' }}>Kids</option>
                  <option value="Unisex" style={{ color: '#000' }}>Unisex</option>
                </Form.Select>
                {error.category && <span className="glass-error-badge">{error.category}</span>}
              </Form.Group>
            </Col>

            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="glass-label">Fashion Style</Form.Label>
                <Form.Select
                  name="style"
                  className="glass-input"
                  onChange={handleChange}
                  value={addproduct.style || 'Casual Wear'}
                >
                  {STYLES.map((st) => (
                    <option key={st} value={st} style={{ color: '#000' }}>
                      {st}
                    </option>
                  ))}
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
                  placeholder="2999"
                  name="prize"
                  className="glass-input"
                  onChange={handleChange}
                  value={addproduct.prize || ''}
                />
                {error.prize && <span className="glass-error-badge">{error.prize}</span>}
              </Form.Group>
            </Col>

            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="glass-label">Stock Status</Form.Label>
                <Form.Select
                  name="stock"
                  className="glass-input"
                  onChange={handleChange}
                  value={addproduct.stock || ''}
                >
                  <option value="" style={{ color: '#000' }}>Select Stock Status</option>
                  <option value="In Stock" style={{ color: '#000' }}>In Stock</option>
                  <option value="Low Stock" style={{ color: '#000' }}>Low Stock</option>
                  <option value="Out of Stock" style={{ color: '#000' }}>Out of Stock</option>
                </Form.Select>
                {error.stock && <span className="glass-error-badge">{error.stock}</span>}
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-3 mb-3">
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="glass-label">Available Sizes (Select multiple)</Form.Label>
                <div className="d-flex flex-wrap gap-2 pt-1">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((sz) => {
                    const isSelected = (addproduct.selectedSizes || []).includes(sz);
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
                        onClick={() => handleSizeToggle(sz)}
                      >
                        {isSelected ? `✓ ${sz}` : sz}
                      </Button>
                    );
                  })}
                </div>
                {error.size && <span className="glass-error-badge mt-2 d-block">{error.size}</span>}
              </Form.Group>
            </Col>

            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label className="glass-label">Fabric / Material</Form.Label>
                <Form.Select
                  name="material"
                  className="glass-input"
                  onChange={handleChange}
                  value={addproduct.material || ''}
                >
                  <option value="" style={{ color: '#000' }}>Select Material</option>
                  {MATERIALS.map((mat) => (
                    <option key={mat} value={mat} style={{ color: '#000' }}>
                      {mat}
                    </option>
                  ))}
                </Form.Select>
                {error.material && <span className="glass-error-badge">{error.material}</span>}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="glass-label">Product Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Describe the fit, features, and styling recommendation..."
              name="description"
              className="glass-input"
              onChange={handleChange}
              value={addproduct.description || ''}
            />
            {error.description && <span className="glass-error-badge">{error.description}</span>}
          </Form.Group>

          <div className="d-grid mt-4">
            <Button type="submit" className="btn-glass-primary py-2" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Uploading Product...
                </>
              ) : (
                'Upload Product'
              )}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );

  if (hideHeader) {
    return formContent;
  }

  return (
    <div className="page-container">
      <Header />
      {formContent}
    </div>
  );
};

export default Addproduct;