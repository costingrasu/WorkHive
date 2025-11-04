import React from "react";
import { Link } from "react-router-dom";

import "../styles/Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">
                    WORK HIVE
                </Link>
            </div>
            <div className="navbar-links">
                <ul>
                    <li>
                        <Link to='/login' className="nav-link">Login</Link>
                    </li>
                    <li>
                        <Link to='/register' className="nav-link register-btn">Register</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;