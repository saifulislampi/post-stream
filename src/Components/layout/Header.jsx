import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

export default function Header({ currentUser }) {
  const location = useLocation();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const toggleOffcanvas = () => setShowOffcanvas(!showOffcanvas);
  const closeOffcanvas = () => setShowOffcanvas(false);

  const navLinks = (
    <div className="nav flex-column">
      <Link 
        to="/" 
        onClick={closeOffcanvas}
        className={`nav-link d-flex align-items-center mb-2 ${location.pathname === "/" ? "active" : ""}`}
        style={{ fontSize: '1.1rem' }}
      >
        <i className="bi bi-house-door-fill me-2"></i>
        <span className="nav-text">Home</span>
      </Link>
      <Link 
        to="/explore" 
        onClick={closeOffcanvas}
        className={`nav-link d-flex align-items-center mb-2 ${location.pathname === "/explore" ? "active" : ""}`}
        style={{ fontSize: '1.1rem' }}
      >
        <i className="bi bi-compass-fill me-2"></i>
        <span className="nav-text">Explore</span>
      </Link>
      {currentUser && (
        <Link 
          to={`/user/${currentUser.id}`} 
          onClick={closeOffcanvas}
          className={`nav-link d-flex align-items-center mb-2 ${location.pathname.startsWith("/user/") ? "active" : ""}`}
          style={{ fontSize: '1.1rem' }}
        >
          <i className="bi bi-person-fill me-2"></i>
          <span className="nav-text">Profile</span>
        </Link>
      )}
    </div>
  );

  return (
    <>
      {/* Permanent sidebar for md+ screens */}
      <nav className="d-none d-md-flex sidebar flex-column p-3 bg-white border-end" style={{ minHeight: "100vh" }}>
        <div className="mb-4">
          <Logo width={200} height={80} />
        </div>
        {navLinks}
        {currentUser && (
          <div className="mt-auto pt-3">
            <div className="d-flex align-items-center">
              <div className="profile-avatar rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: 48, height: 48, background: "#007bff", color: "#fff", fontSize: "1.4rem" }}>
                {currentUser.firstName?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <div className="fw-bold">{currentUser.firstName} {currentUser.lastName}</div>
                <div className="text-muted">@{currentUser.username}</div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Top navbar with hamburger for small screens */}
      <nav className="d-md-none navbar navbar-light bg-white border-bottom">
        <div className="container-fluid">
          <button className="btn" onClick={toggleOffcanvas}>
            <i className="bi bi-list" style={{ fontSize: "1.5rem" }}></i>
          </button>
          <Logo width={150} height={60} />
          {currentUser && (
            <button className="btn">
              <div className="profile-avatar rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, background: "#007bff", color: "#fff", fontSize: "1.2rem" }}>
                {currentUser.firstName?.[0]?.toUpperCase() || "?"}
              </div>
            </button>
          )}
        </div>
      </nav>

      {/* Offcanvas sidebar for small screens */}
      {showOffcanvas && (
        <>
          <div className="offcanvas-backdrop show" onClick={closeOffcanvas}></div>
          <div className="offcanvas offcanvas-start show" style={{ width: "250px", visibility: "visible" }}>
            <div className="offcanvas-header">
              <Logo width={200} height={80} />
              <button type="button" className="btn-close text-reset" onClick={closeOffcanvas}></button>
            </div>
            <div className="offcanvas-body">
              {navLinks}
              {currentUser && (
                <div className="mt-auto pt-3">
                  <div className="d-flex align-items-center">
                    <div className="profile-avatar rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: 48, height: 48, background: "#007bff", color: "#fff", fontSize: "1.4rem" }}>
                      {currentUser.firstName?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="fw-bold">{currentUser.firstName} {currentUser.lastName}</div>
                      <div className="text-muted">@{currentUser.username}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}