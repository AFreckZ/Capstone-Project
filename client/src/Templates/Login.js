//Import CSS
import React, { useState} from "react";
import {useNavigate} from "react-router-dom";
import  "../css/Login.css"
import SunsetImage from "../images/sunset.jpg";
// import ProfilePage from './Templates/ProfilePage';

function Login() {
 const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

   const navigate = useNavigate();

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
      const response = await fetch("http://localhost:5001/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token based on remember me preference
      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      
      setSuccessMessage("Login successful!");
      setError(""); // Clear any errors  
      navigate("/user");    
      setEmail("");
      setPassword("");
      setRememberMe(false);
      setTimeout(() => {
      
      console.log("Redirecting to dashboard...");
    }, 1500);
      
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
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Eco-icon.png/600px-Eco-icon.png"
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
