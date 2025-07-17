import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import Avatar from "../shared/Avatar";

export default function Header({ currentUser, currentProfile, onLogout }) {
  const location = useLocation();
  // Close mobile navbar when clicking on nav links
  const closeMobileNav = () => {
    const navbarCollapse = document.getElementById("mobileNav");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      const bsCollapse = new window.bootstrap.Collapse(navbarCollapse);
      bsCollapse.hide();
    }
  };

  return (
    <>
      {/* Desktop Sidebar - Only on large screens */}
      <aside className="sidebar d-none d-lg-block">
        <div className="sidebar-content">
          <div className="mb-4 mt-3">
            <Logo width={160} height={64} />
          </div>
          <nav className="nav flex-column">
            <Link
              to="/"
              className={`nav-link ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              <i className="bi bi-house-door-fill"></i>
              <span>Home</span>
            </Link>
            <Link
              to="/explore"
              className={`nav-link ${
                location.pathname === "/explore" ? "active" : ""
              }`}
            >
              <i className="bi bi-search"></i>
              <span>Explore</span>
            </Link>
            {currentProfile && (
              <Link
                to={`/profile/${currentProfile.id}`}
                className={`nav-link ${
                  location.pathname.startsWith("/profile/") ? "active" : ""
                }`}
              >
                <i className="bi bi-person-fill"></i>
                <span>Profile</span>
              </Link>
            )}
          </nav>
          {currentProfile && (
            <div className="mt-auto mb-3">
              <div className="user-info-card">
                <Avatar profile={currentProfile} size={40} className="me-3" />
                <div className="flex-grow-1">
                  <div className="fw-bold small">
                    {currentProfile.firstName} {currentProfile.lastName}
                  </div>
                  <div className="text-muted small">
                    @{currentProfile.username}
                  </div>
                </div>
              </div>
              <button
                className="btn btn-outline-secondary btn-sm w-100 mt-2"
                onClick={onLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Header - Shows when desktop sidebar is hidden */}
      <header className="mobile-header d-lg-none">
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
          <div className="container-fluid px-3">
            <Link className="navbar-brand" to="/" onClick={closeMobileNav}>
              <Logo width={120} height={32} />
            </Link>

            <button
              className="navbar-toggler border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mobileNav"
              aria-controls="mobileNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="mobileNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/" ? "active" : ""
                    }`}
                    to="/"
                    onClick={closeMobileNav}
                  >
                    <i className="bi bi-house-door-fill me-2"></i>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/explore" ? "active" : ""
                    }`}
                    to="/explore"
                    onClick={closeMobileNav}
                  >
                    <i className="bi bi-search me-2"></i>
                    Explore
                  </Link>
                </li>
                {currentProfile && (
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        location.pathname.startsWith("/profile/")
                          ? "active"
                          : ""
                      }`}
                      to={`/profile/${currentProfile.id}`}
                      onClick={closeMobileNav}
                    >
                      <i className="bi bi-person-fill me-2"></i>
                      Profile
                    </Link>
                  </li>
                )}
              </ul>

              {currentProfile && (
                <div className="navbar-text ms-3 d-flex align-items-center">
                  <Avatar profile={currentProfile} size={32} fontSize="1rem" className="me-2" />
                  <span className="small me-2">
                    {currentProfile.firstName} {currentProfile.lastName}
                  </span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={onLogout}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
