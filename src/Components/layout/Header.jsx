import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

export default function Header({ currentUser }) {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar - Only visible on large screens */}
      <nav className="d-none d-lg-flex sidebar flex-column p-3 bg-white border-end position-sticky" style={{ minHeight: "100vh", top: 0, width: "280px" }}>
        <div className="mb-4">
          <Logo width={160} height={64} />
        </div>
        <div className="nav flex-column">
          <Link 
            to="/" 
            className={`nav-link d-flex align-items-center ${location.pathname === "/" ? "active" : ""}`}
          >
            <i className="bi bi-house-door-fill me-3"></i>
            <span>Home</span>
          </Link>
          <Link 
            to="/explore" 
            className={`nav-link d-flex align-items-center ${location.pathname === "/explore" ? "active" : ""}`}
          >
            <i className="bi bi-search me-3"></i>
            <span>Explore</span>
          </Link>
          {currentUser && (
            <Link 
              to={`/user/${currentUser.id}`} 
              className={`nav-link d-flex align-items-center ${location.pathname.startsWith("/user/") ? "active" : ""}`}
            >
              <i className="bi bi-person-fill me-3"></i>
              <span>Profile</span>
            </Link>
          )}
        </div>
        {currentUser && (
          <div className="mt-auto pt-3">
            <div className="d-flex align-items-center p-3 rounded-pill" style={{ backgroundColor: "var(--hover)" }}>
              <div
                className="profile-avatar rounded-circle me-3"
                style={{ width: 40, height: 40, fontSize: "1.2rem" }}
              >
                {currentUser.firstName?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-grow-1">
                <div className="fw-bold small">{currentUser.firstName} {currentUser.lastName}</div>
                <div className="text-muted small">@{currentUser.username}</div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Bootstrap Navbar for mobile/tablet - Properly collapsible */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom d-lg-none sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <Logo width={120} height={32} />
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === "/" ? "active" : ""}`} 
                  to="/"
                >
                  <i className="bi bi-house-door-fill me-2"></i>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === "/explore" ? "active" : ""}`} 
                  to="/explore"
                >
                  <i className="bi bi-search me-2"></i>
                  Explore
                </Link>
              </li>
              {currentUser && (
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname.startsWith("/user/") ? "active" : ""}`} 
                    to={`/user/${currentUser.id}`}
                  >
                    <i className="bi bi-person-fill me-2"></i>
                    Profile
                  </Link>
                </li>
              )}
            </ul>
            
            {currentUser && (
              <div className="d-flex align-items-center">
                <div
                  className="profile-avatar rounded-circle me-2"
                  style={{ width: 32, height: 32, fontSize: "1rem" }}
                >
                  {currentUser.firstName?.[0]?.toUpperCase() || "?"}
                </div>
                <span className="navbar-text small">
                  {currentUser.firstName} {currentUser.lastName}
                </span>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}