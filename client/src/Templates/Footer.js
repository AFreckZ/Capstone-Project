import { Link } from 'react-router-dom';
import '../css/Footer.css'; 
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


function Footer() {
  
  return(
  <footer className="footer">
          <div>
            <h3>Company</h3>
            <p>About Us</p>
          </div>
          <div>
            <h3>Contact</h3>
            <p>Email</p>
          </div>
          <div>
            <h3>Further</h3>
            <p>Activities</p>
            <p>Restaurants</p>
          </div>
          <div>
            <h3>Discover</h3>
            <p>🌐 App Store / Google Play</p>
          </div>
        </footer>
        )
}

export default Footer;