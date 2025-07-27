import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  console.log(loading)

  if (loading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};


export default PrivateRoute;
