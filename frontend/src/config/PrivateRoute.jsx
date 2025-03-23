import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element }) => {
  const { user } = useAuth();
  
  return user ? element : <Navigate to="/connexion" />;
};

export default PrivateRoute;