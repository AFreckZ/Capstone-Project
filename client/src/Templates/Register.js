import React, { useState } from "react";
import axios from 'axios';
//import React from "react";
import "../css/Register.css";
import Beach from "../images/Beach.jpg";
//import { Icon } from "react-icons-kit";
//import { eye } from "react-icons-kit/feather/eye.js";
//import { eyeOff } from "react-icons-kit/feather/eyeOff.js";

function Register() {
  //const [showPassword, setShowPassword] = useState(false);
  //const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: null
  });
  
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.password.length<8) newErrors.password='passwords should be atleast 8 characters';
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
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: null
      });

      // Redirect or show success message
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
    };

  
  return (
    <div className="register-container">
      <div className="register-left">
        <img
          src={Beach} // Replace this
          alt="Beach"
          className="register-image"
        />
      </div>

      <div className="register-right">
        <div className="register-form-container">
          <div className="register-logo">
            <img src="/path-to-logo.png" alt="Logo" />
          </div>
          <h2 className="register-title">Register</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <label>
              Name:*<input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"/>
            {errors.name && <span className="error">{errors.name}</span>}

            </label>
            <label>
              Email:*<input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email" />
            {errors.email && <span className="error">{errors.email}</span>}

            </label>

            <label required className="password-field">
              Password:*
              <input
                //type={showPassword ? "text" : "password"}
                placeholder="Enter password"
              />
              <span
                className="icon-eye"
                //onClick={() => setShowPassword(!showPassword)}
              >
              </span>
            </label>

            <label required  className="password-field">
              Confirm Password:*
              <input
               // type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
              />
              <span
                className="icon-eye"
                //onClick={() => setShowConfirm(!showConfirm)}
              >
            
              </span>
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

          <button className="google-btn">
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" /> 
            Continue with Google
          </button>

          <p className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
