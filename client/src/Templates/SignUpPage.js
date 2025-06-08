import React from "react";
import "../css/SignUpPage.css";
import { useNavigate } from "react-router-dom";


function SignUpPage() {
  const navigate = useNavigate();
  return (
    <div className="signup-container">
      <header className="signup-header">
        <h1>Join Yaad Quest</h1>
        <button className="login-button" onClick={() => navigate("/login")}>Login</button>
      </header>
      <div className="signup-options">
        <div className="signup-card">
          <h2>Business Owner</h2>
          <p>Promote your venue or event and attract tourists easily.</p>
          <button className="signup-btn" 
          onClick={() => navigate("/business-profile")}
           >Sign Up as Business</button>
        </div>
        <div className="signup-card">
          <h2>Tourist</h2>
          <p>Discover exciting places and experiences in Jamaica.</p>
          <button className="signup-btn" onClick={() => navigate("/tourist-profile")}>Sign Up as Tourist</button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
