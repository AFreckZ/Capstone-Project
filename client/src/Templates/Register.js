import React, { useState } from "react";
import axios from 'axios';
import { useNavigate} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
//import React from "react";
import "../css/Register.css";
import Beach from "../images/Beach.jpg";
import logo from "../images/logo.png";

function Register() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: null
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
const {register, login, isAuthenticated, user, userType} = useAuth();  
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const currentUserType = userType || user.userType || user.usertype;
      
      switch(currentUserType) {
        case 'tourist':
          navigate('/tourist-profile');
          break;
        case 'business-owner':
          navigate('/business-profile');
          break;
        case 'transport-agency':
          navigate('/travel-profile');
          break;
        
      }
    }
  }, [isAuthenticated, user, userType, navigate]);

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
      // Step 1: Register the user
      const registerResult = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType
      });

      if (registerResult.success) {
        setSuccessMessage('Registration successful! Logging you in...');
        console.log('Registration successful:', registerResult.data);
        
        // Step 2: Automatically log the user in
        const loginResult = await login({
          email: formData.email,
          password: formData.password
        });

        if (loginResult.success) {
          console.log('Auto-login successful:', loginResult.user);
          
          // Step 3: Navigate to appropriate profile/dashboard based on user type
          const userType = loginResult.user?.userType || loginResult.user?.usertype || formData.userType;
          
          switch(userType) {
            case 'tourist':
              navigate('/tourist-profile'); 
              break;
            case 'business-owner':
              navigate('/business-profile'); 
              break;
            case 'transport-agency':
              navigate('/transport-profile'); 
              break;
            default:
              navigate('/user'); // fallback
          }
        } else {
          // Registration worked but login failed - redirect to login page
          setSuccessMessage('Registration successful! Please log in.');
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          userType: null
        });

      } else {
        setErrors({
          submit: registerResult.error || 'Registration failed. Please try again.'
        });
      }

    } catch (error) {
      console.error('Registration/Login error:', error);
      setErrors({
        submit: error.message || 'Registration failed. Please try again.'
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
}

// export default Register;
export default Register;
