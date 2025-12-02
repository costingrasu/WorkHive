import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "../styles/Forms.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("/api/auth/login", formData);

      console.log(response.data);

      if (response.data.token) {
        login(response.data.token);
        navigate("/");
      } else {
        setError("Invalid response.");
      }
    } catch (err) {
      console.error(err);
      setError("Incorrect email or password.");
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Login</h2>

      {error && <div className="form-error">{error}</div>}

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
        Login
      </button>
    </form>
  );
};

export default LoginPage;
