//import React, { useState } from "react";
import React from "react";
import "../css/Register.css";
import Beach from "../images/Beach.jpg";
//import { Icon } from "react-icons-kit";
//import { eye } from "react-icons-kit/feather/eye.js";
//import { eyeOff } from "react-icons-kit/feather/eyeOff.js";

function Register() {
  //const [showPassword, setShowPassword] = useState(false);
  //const [showConfirm, setShowConfirm] = useState(false);

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
          <form className="register-form">
            <label>
              Name:*<input type="text" placeholder="Enter your name" />
            </label>
            <label>
              Email:*<input type="email" placeholder="Enter your email" />
            </label>

            <label className="password-field">
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

            <label className="password-field">
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

            <button type="submit" className="continue-btn">Continue</button>
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
