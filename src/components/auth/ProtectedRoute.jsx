import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "./AuthService";

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default ProtectedRoute;
