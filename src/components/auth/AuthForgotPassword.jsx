import React, { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "./AuthService";

const AuthForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="row w-100">
          <div className="col-md-6 col-lg-4 mx-auto">
            <div className="card shadow">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Check Your Email</h2>
                  <p className="text-muted">Password reset instructions sent</p>
                </div>

                <div className="alert alert-success">
                  <i className="bi bi-check-circle me-2"></i>
                  We've sent a password reset link to <strong>{email}</strong>
                </div>

                <div className="text-center">
                  <p className="text-muted small">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>

                <div className="d-grid mb-3">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                    }}
                  >
                    Try Again
                  </button>
                </div>

                <div className="text-center">
                  <Link to="/login" className="text-decoration-none">
                    ← Back to Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">
        <div className="col-md-6 col-lg-4 mx-auto">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Reset Password</h2>
                <p className="text-muted">Enter your post-stream email to get password reset instructions</p>
              </div>

              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="alert alert-danger">{error}</div>
                )}

                <div className="d-grid mb-3">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={!email.trim() || loading}
                  >
                    {loading ? "Sending..." : "Send Reset Email"}
                  </button>
                </div>
              </form>

              <div className="text-center">
                <span className="text-muted">Remember your password? </span>
                <Link to="/login" className="text-decoration-none">
                  Sign In
                </Link>
              </div>

              <div className="text-center mt-3">
                <Link to="/auth" className="text-muted text-decoration-none">
                  ← Back to welcome
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForgotPassword;
