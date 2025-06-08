import React from "react";
import "../css/SignUpPage.css";

function SignUpPage() {
  return (
    <div className="signup-container">
      <header className="signup-header">
        <h1>Join Yaad Quest</h1>
        <button className="login-button">Login</button>
      </header>
      <div className="signup-options">
        <div className="signup-card">
          <h2>Business Owner</h2>
          <p>Promote your venue or event and attract tourists easily.</p>
          <button className="signup-btn">Sign Up as Business</button>
        </div>
        <div className="signup-card">
          <h2>Tourist</h2>
          <p>Discover exciting places and experiences in Jamaica.</p>
          <button className="signup-btn">Sign Up as Tourist</button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
