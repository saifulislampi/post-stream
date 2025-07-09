import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "./AuthService";

// ProtectedRoute - Requires authentication
const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children || <Outlet />;
};

export default ProtectedRoute;
