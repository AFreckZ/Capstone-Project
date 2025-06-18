//Import CSS
import React, { useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from '../contexts/AuthContext';
import  "../css/Login.css"
import SunsetImage from "../images/sunset.jpg";
import logo from "../images/logo.png";

function Login() {
 const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const {login, isAuthenticated,user, userType} = useAuth();
  const navigate = useNavigate();
  
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
        default:
          navigate('/user'); // fallback
      }
    }
  }, [isAuthenticated, user, userType, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);

  
    try {
      // Use the AuthContext login function instead of direct fetch
      const result = await login({ email, password });
      
      if (result.success) {
        setSuccessMessage("Login successful!");
        setError(""); 
        
        // Handle remember me - store in localStorage if checked
        if (rememberMe && result.user) {
          localStorage.setItem("rememberUser", "true");
        }
        
        // Navigate based on user type
        const userType = result.user?.userType || result.user?.usertype;
        console.log('User type for navigation:', userType);
        
        switch(userType) {
          case 'tourist':
            navigate('/tourist-profile');
            break;
          case 'business-owner':
            navigate('/business-dashboard');
            break;
          case 'transport-agency':
            navigate('/transport-dashboard');
            break;
          default:
            navigate('/user');
        }
        
        // Clear form
        setEmail("");
        setPassword("");
        setRememberMe(false);
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    const passwordInput = document.querySelector(".password-input input");
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  };
    return(
<div className="container">
      <div className="image-side">
        <div className="circle-image">
          <img
            src={SunsetImage}
            alt="Sunset"
          />
        </div>
      </div>
      <div className="form-side">
        <div className="form-box">
          <img
            src={logo}
            alt="Logo"
            className="logo"
          />
          <h2>Log In</h2>
          {successMessage && (
          <div className="success-message" style={{color: 'green', marginTop: '10px'}}>{successMessage}
          </div>)}

          {error && (
            <div className="error-message" style={{color: 'red', marginTop: '10px'}}>
              {error}
            </div>
          )}
           <form onSubmit={handleSubmit}>

            <label>Email:*</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password:*</label>
            <div className="password-input">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                role="img"
                aria-label="eye"
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              >
                
              </span>
            </div>
            <div className="options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />{" "}
                Keep me logged in
              </label>
              <a href="/forgot-password">Forgot your password?</a>
            </div>
            <button
              type="submit"
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
          <div className="divider" />
          <button className="google-btn">
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
            Continue with Google
          </button>
          <p className="signup-text">
            Don’t have an account? <a href="/register">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
