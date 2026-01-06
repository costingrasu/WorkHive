import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className="nav-link"
                    style={{ color: "#d9534f", fontWeight: "bold" }}
                  >
                    Admin Panel
                  </Link>
                </li>
              )}

              <li>
                <Link
                  to="/reserve"
                  className="register-btn new-reservation-btn"
                >
                  <span>+</span> New Reservation
                </Link>
              </li>
              <li>
                <Link to="/" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="nav-link logout-btn">
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
                <Link to="/register" className="nav-link register-btn">
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
