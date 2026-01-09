import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const path = location.pathname;
  const isAdminPage = path === "/admin";
  const isReservePage = path === "/reserve";
  const isDashboardPage = !isAdminPage && !isReservePage;

  let sliderClass = "";

  if (isAdmin) {
    if (isAdminPage) {
      sliderClass = "slide-3-pos-1 slider-red";
    } else if (isReservePage) {
      sliderClass = "slide-3-pos-2 slider-brown";
    } else {
      sliderClass = "slide-3-pos-3 slider-brown";
    }
  } else {
    if (isReservePage) {
      sliderClass = "slide-2-pos-1 slider-brown";
    } else {
      sliderClass = "slide-2-pos-2 slider-brown";
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo-container">
          <span className="main-logo-text">WORK HIVE</span>
          <span className="hover-slogan">
            Reserve the place you need to bee!
          </span>
        </Link>
      </div>
      <div className="navbar-links">
        <ul>
          {isLoggedIn ? (
            <>
              <li className="toggle-wrapper">
                <div
                  className={`nav-toggle-container ${
                    isAdmin ? "three-items" : "two-items"
                  }`}
                >
                  <div className={`nav-toggle-slider ${sliderClass}`} />

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`nav-toggle-item admin-item ${
                        isAdminPage ? "active" : ""
                      }`}
                    >
                      Admin Panel
                    </Link>
                  )}

                  <Link
                    to="/reserve"
                    className={`nav-toggle-item ${
                      isReservePage ? "active" : ""
                    }`}
                  >
                    <span>+</span> New Reservation
                  </Link>

                  <Link
                    to="/"
                    className={`nav-toggle-item ${
                      isDashboardPage ? "active" : ""
                    }`}
                  >
                    Dashboard
                  </Link>
                </div>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="register-btn">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
