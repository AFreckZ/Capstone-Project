import '../css/Header.css'; 
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


function Header() {
  const { logout } = useAuth();
  const navigate= useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className="profile-container">
    <header className="trip-header">
           <div className="header-content">
             <div className="logo">Yaad Quest</div>
             <nav className="nav-links">
               <a href="#">Home</a>
               <a href="/search">Explore</a>
               <a href="#">Activities</a>
               <a href="#">About Us</a>
              
               
             </nav>
             <div className="avatar"></div>
             <button onClick={handleLogout}>logout</button>
           </div>
         </header>      
               </div>
  );
}

export default Header;