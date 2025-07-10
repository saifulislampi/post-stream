import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../components/auth/AuthService";

// ProtectedRoute - Requires authentication
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  return children || <Outlet />;
};

export default ProtectedRoute;
