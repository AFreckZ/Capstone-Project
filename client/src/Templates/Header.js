import { Link } from 'react-router-dom';
import '../css/Header.css'; 

function Header() {
  return (
    <header className="header">
      <nav>
        <Link to="/" className="logo">MyApp</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;