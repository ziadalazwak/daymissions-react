import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return children;
};

export default ProtectedRoute; 