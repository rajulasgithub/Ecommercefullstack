import React from 'react';
import { Navigate } from 'react-router-dom';
import ROLES from '../utils/roles';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If seller/company tries to access an unauthorized route, redirect to seller dashboard
    if (role === ROLES.COMPANY || role === ROLES.SELLER || role === 'seller' || role === 'company') {
      return <Navigate to="/sellerdashboard" replace />;
    } else {
      return <Navigate to="/viewproduct" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
