import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../css/ProfilePage.css';
import profileImage from '../images/sunset.jpg'; 
import { Link } from 'react-router-dom';
import {useNavigate} from "react-router-dom";


const TouristProfilePage = () => {
    const { user, userId, userType, loading, isAuthenticated,logout } = useAuth();
    const navigate= useNavigate();
    const [trip] = useState({
      name: "Create your dream vacation by entering your preferences below",
    
     
    });

  const favorites = [
    { label: "Restaurants", count: 10, image: "https://source.unsplash.com/100x100/?food" },
    { label: "Attractions", count: 50, image: "https://source.unsplash.com/100x100/?museum" },
    { label: "Cities", count: 2, image: "https://source.unsplash.com/100x100/?city" },
    { label: "Beaches", count: 3, image: "https://source.unsplash.com/100x100/?beach" }
  ];
  if (loading) {
      return <div>Loading...</div>;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      return <div>Please log in to view your profile.</div>;
    }

    // Show message if user data is not available
    if (!user) {
      return <div>User data not available. Please try logging in again.</div>;
    }
const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const enterinfo=()=>{
    navigate('/preferences')
  }

  return (


    <div className="profile-container">

      <header className="trip-header">
        <div className="header-content">
          <div className="logo">Yaad Quest</div>
          <nav className="nav-links">
            <a href="#">Home</a>
            <a href="#">Explore</a>
            <a href="#">Activities</a>
           
          </nav>
          <button onClick={handleLogout}>logout</button>
        </div>
      </header>
      <div>

    <div className="content-body">
      <aside className="sidebar">
        <img src={profileImage} alt="User" className="profile-pic" />
        <h2>Welcome {user.username}</h2>

        <h3>Preferences</h3>
        <div className="preferences">
          <span>🏛️ Museums</span>
          <span>🎉 Festivals</span>
          <span>🍽️ Restaurants</span>
        </div>
        <Link to="/preferences">Edit Preferences</Link>

      </aside>

      <main className="main-content">
        <section className="my-trip">
          <div className="trip-details">
            <h2>{trip.name}</h2>
            <p>{trip.dates}</p>
            <button className="btn" onClick={enterinfo}>Create Itinerary</button>
          </div>
        </section>

        <section className="favorites">
          <h2>Explore Venues and Events</h2>
          <div className="favorite-items">
            {favorites.map((item, index) => (
              <div className="favorite-card" key={index}>
                <img src={item.image} alt={item.label} />
                <p>{item.label}</p>
                <small>{item.count} {item.label.toLowerCase()}</small>
              </div>
            ))}
          </div>
        </section>

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
      </main>
    </div>
  </div>
  </div>
  );
};

export default TouristProfilePage;
