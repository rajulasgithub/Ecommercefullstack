import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h1 className="display-1 fw-bold text-warning">403</h1>
      <h2 className="mb-4">Unauthorized Access</h2>
      <p className="lead mb-4">
        You do not have permission to view this page.
      </p>
      <div className="d-flex justify-content-center gap-3">
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Go to Home
        </button>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
