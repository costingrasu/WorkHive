import React from "react";
import { useNavigate } from "react-router-dom";

import '../styles/Forms.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/login');
  };
  
  return (
    <div className="dashboard-container">
      <h2>Reserve the place you need to bee!</h2>
      <p>
        Logged in successfully. This is your dashboard.
        <br />
        Here you can make reservations, view them, and manage your account.
      </p>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  )
};

export default DashboardPage;
