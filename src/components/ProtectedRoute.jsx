import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Assurez-vous que le chemin est correct

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.is_admin) {
    // Si la route nécessite les droits admin et que l'utilisateur n'est pas admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
