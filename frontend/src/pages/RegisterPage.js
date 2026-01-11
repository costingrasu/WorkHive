import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "../styles/Forms.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", formData);

      if (response.data.token) {
        login(response.data.token);
        setSuccess("Account created! Redirecting to Dashboard...");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Register</h2>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      <div className="input-wrapper">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="form-input"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-wrapper">
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="form-input"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-wrapper">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-input"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-wrapper">
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-input"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-wrapper">
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="form-input"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="form-button">
        Create account
      </button>
    </form>
  );
};

export default RegisterPage;
