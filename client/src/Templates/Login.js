//Import CSS
import  "../css/Login.css"
import SunsetImage from "../images/sunset.jpg";

function Login() {
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
          <form>
            <label>Email:*</label>
            <input type="email" placeholder="Enter email" />
            <label>Password:*</label>
            <div className="password-input">
              <input type="password" placeholder="Enter password" />
              <span role="img" aria-label="eye">👁️</span>
            </div>
            <div className="options">
              <label>
                <input type="checkbox" /> Keep me logged in
              </label>
              <a href="#top">Forgot your password?</a>
            </div>
            <button type="submit" className="login-btn">Log In</button>
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
