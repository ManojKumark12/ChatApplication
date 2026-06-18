import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style_css/Auth.css';
import { navigateTo } from '../common/helper_functions';
import apiFetch from '../common/apiFetch';
import { toast } from "react-toastify";

import { useDispatch } from 'react-redux';
import { loginfunc } from '../redux/User.slice';
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.email.trim() || !formData.password.trim()) {
        setErrors(true);
        return;
      } else {
        setErrors(false);
      }
      console.log("trying");
      const response = await apiFetch(
        `${import.meta.env.VITE_API_URL}/user/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {

        toast.error(
          data.message || "Something went wrong."
        );

        return;
      }

      toast.success(data.message);

      dispatch(loginfunc(data.user));

      navigateTo(navigate, "/");

    } catch (error) {
      toast.error(error.message);
    }
    // Later you will send this to backend
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Please enter your details</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {errors && (
            <p style={{ color: "red", marginBottom: "10px" }}>
              Please enter email and password
            </p>
          )}          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}

            // required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            // required
            />
          </div>

          <button type="submit" className="btn-primary">
            Sign In
          </button>

        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;