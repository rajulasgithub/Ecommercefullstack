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
    // If company tries to access customer page or vice versa, redirect appropriately
    if (role === ROLES.COMPANY) {
      return <Navigate to="/viewproduct" replace />;
    } else {
      return <Navigate to="/viewproduct" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
