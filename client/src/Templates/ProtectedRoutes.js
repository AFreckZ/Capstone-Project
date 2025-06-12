import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Basic protected route (any authenticated user)
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Role-based protected route
export const RoleProtectedRoute = ({ children, allowedRoles, redirectTo = "/unauthorized" }) => {
  const { isAuthenticated, loading, userType } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Specific role routes for convenience
export const TouristRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles={['tourist']}>
    {children}
  </RoleProtectedRoute>
);

export const BusinessOwnerRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles={['business-owner']}>
    {children}
  </RoleProtectedRoute>
);

export const TransportAgencyRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles={['transport-agency']}>
    {children}
  </RoleProtectedRoute>
);

// Multiple roles allowed
export const BusinessAndTransportRoute = ({ children }) => (
  <RoleProtectedRoute allowedRoles={['business-owner', 'transport-agency']}>
    {children}
  </RoleProtectedRoute>
);

export default ProtectedRoute;