import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Ensures only authenticated users with correct roles can access specific routes.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('token');

  // 1. Direct check for token to prevent any bypass
  if (!token || !user) {
    // Redirect to login but keep the intended location for post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role-based access control
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`Unauthorized access attempt to ${location.pathname} by role: ${user.role}`);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
