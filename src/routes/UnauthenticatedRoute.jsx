import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../components/auth/AuthService";

// UnauthenticatedRoute - Allows access to auth pages only if user is not logged in
const UnauthenticatedRoute = ({ children }) => {
  if (isAuthenticated()) {
    // If user is already logged in, redirect to home page
    return <Navigate to="/" replace />;
  }
  // If user is not logged in, allow access to auth pages
  return children || <Outlet />;
};

export default UnauthenticatedRoute;
