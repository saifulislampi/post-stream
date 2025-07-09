import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "./AuthService";

const AuthRegister = () => {
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(newUser);
      navigate("/auth", {
        state: { registered: true },
      });
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
          <h2 className="fw-bold">Create Account</h2>
          <p className="text-muted">Join Post Stream today</p>
        </div>

        <form onSubmit={onSubmitHandler}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                value={newUser.firstName}
                onChange={onChangeHandler}
                name="firstName"
                placeholder="First Name"
                required
                disabled={loading}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                value={newUser.lastName}
                onChange={onChangeHandler}
                name="lastName"
                placeholder="Last Name"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={newUser.email}
              onChange={onChangeHandler}
              name="email"
              placeholder="Email"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={newUser.username}
              onChange={onChangeHandler}
              name="username"
              placeholder="Username"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={newUser.password}
              onChange={onChangeHandler}
              name="password"
              placeholder="Password"
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <span className="text-muted">Already have an account? </span>
          <Link to="/login" className="text-decoration-none">
            Sign in
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

export default AuthRegister;
