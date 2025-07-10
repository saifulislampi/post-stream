import React, { useState } from "react";
import { Link } from "react-router-dom";

const AuthLogin = ({ onLogin }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onLogin(form.username, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow">
      <div className="card-body p-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Sign In</h2>
          <p className="text-muted">Welcome back to Post Stream</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              name="username"
              type="text"
              className="form-control"
              value={form.username}
              onChange={onChange}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={onChange}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-grid mb-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <span className="text-muted">Don't have an account? </span>
          <Link to="/register" className="text-decoration-none">
            Create one
          </Link>
        </div>

        <div className="text-center mt-3">
          <Link to="/auth" className="text-muted text-decoration-none">
            ← Back to welcome
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
