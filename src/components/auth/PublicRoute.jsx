import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "./AuthService";

const PublicRoute = ({ children }) => {
  const user = getCurrentUser();
  if (user) {
    // If user is already logged in, redirect to home page
    return <Navigate to="/" replace />;
  }
  // If user is not logged in, allow access to auth pages
  return children;
};

export default PublicRoute;
