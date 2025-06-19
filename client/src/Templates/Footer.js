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
                <p>yaadquest@gmail.com</p>
              </div>
              <div>
                <h3> <a href="/search">Explore other businesses</a></h3>
                </div>
        </footer>
        );
};

export default Footer;