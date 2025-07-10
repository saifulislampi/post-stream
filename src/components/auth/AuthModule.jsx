import React from "react";
import { Link, useLocation } from "react-router-dom";

const AuthModule = () => {
  const location = useLocation();
  const registered = location.state?.registered;

  return (
    <div className="card shadow">
      <div className="card-body text-center p-5">
        <h1 className="display-4 fw-bold text-primary mb-4">Post Stream</h1>
        <p className="lead text-muted mb-4">
          Join the conversation. Share your thoughts with the world.
        </p>

        {registered && (
          <div className="alert alert-success" role="alert">
            Registration successful! Please log in to continue.
          </div>
        )}

        <div className="d-grid gap-3 col-8 mx-auto">
          <Link to="/login" className="btn btn-primary btn-lg">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-outline-primary btn-lg">
            Create Account
          </Link>
        </div>

        <p className="text-muted mt-4 small">
          Connect with friends and discover what's happening around the world.
        </p>
      </div>
    </div>
  );
};

export default AuthModule;
