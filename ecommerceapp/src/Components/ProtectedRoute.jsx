import React from 'react';
import { Navigate } from 'react-router-dom';
import ROLES from '../utils/roles';
import Unauthorized from './Unauthorized';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isProfileComplete = localStorage.getItem('isProfileComplete');

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Unauthorized />;
  }

  if (isProfileComplete === 'false' || isProfileComplete === false) {
    const userRole = String(role).toLowerCase();
    if (userRole === 'seller' || userRole === 'company') {
      return <Navigate to="/complete-seller-profile" replace />;
    } else {
      return <Navigate to="/complete-profile" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
