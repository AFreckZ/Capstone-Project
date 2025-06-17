import React, { useState } from "react";
import axios from 'axios';
//import React from "react";
import "../css/Register.css";
import Beach from "../images/Beach.jpg";
//import { Icon } from "react-icons-kit";
//import { eye } from "react-icons-kit/feather/eye.js";
//import { eyeOff } from "react-icons-kit/feather/eyeOff.js";
import logo from "../images/Logo(YaadQuest).png";

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: null
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password should be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.userType) newErrors.userType = 'Please select a user type';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, userType: type }));
    if (errors.userType) setErrors(prev => ({ ...prev, userType: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const response = await axios.post('http://localhost:5001/api/user/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType
      });

      setSuccessMessage('Registration successful!');
      console.log('Registration response:', response.data);
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: null
      });

    } catch (error) {
      console.error('Registration error:', error.response?.data);
      setErrors({
        submit: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <img
          src={Beach}
          alt="Beach"
          className="register-image"
        />
      </div>

      <div className="register-right">
        <div className="register-form-container">
          <div className="register-logo">
            <img src={logo} alt="Logo" />
          </div>
          <h2 className="register-title">Register</h2>
          
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          
          <form className="register-form" onSubmit={handleSubmit}>
            <label>
              Name:*
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </label>

            <label>
              Email:*
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </label>

            <label className="password-field">
              Password:*
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </label>

            <label className="password-field">
              Confirm Password:*
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </label>

            <div className="user-type-group">
              <span className="user-type-label">I am a:*</span> 
              {['tourist', 'business-owner', 'transport-agency'].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`user-type-btn ${formData.userType === type ? 'active' : ''}`}
                  onClick={() => handleUserTypeSelect(type)}
                >
                  {type.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                </button>
              ))}
              {errors.userType && <span className="error">{errors.userType}</span>}
            </div>

            <button 
              type="submit" 
              className="continue-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Continue'}
            </button>
        
            {errors.submit && <div className="error">{errors.submit}</div>}
          </form>          
          
          <hr className="divider" />

          

          <p className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// export default Register;
export default Register;
