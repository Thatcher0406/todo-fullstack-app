import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <div style={{ padding: 24 }}>Loading session...</div>;
  }

  return isAuthenticated ? children : <Navigate to='/login' />;
};

export default PrivateRoute;
