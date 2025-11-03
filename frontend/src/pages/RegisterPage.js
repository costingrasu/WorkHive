import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/Forms.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        formData
      );

      console.log(response.data);

      setSuccess("Success! Redirecting to the login page.");
      setFormData({ firstName: "", lastName: "", email: "", password: "" });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data) {
        setError("Error. The email may be already in use.");
      } else {
        setError("Temporary offline service.");
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

      <button type="submit" className="form-button">
        Create account
      </button>
    </form>
  );
};

export default RegisterPage;
