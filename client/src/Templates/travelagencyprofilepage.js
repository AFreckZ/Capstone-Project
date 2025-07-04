import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../css/ProfilePage.css';
import profileImage from '../images/sunset.jpg'; 
import { Link } from 'react-router-dom';
import {useNavigate} from "react-router-dom";


const TravelProfilePage = () => {
    const { user, userId, userType, loading, isAuthenticated,logout } = useAuth();
    const navigate= useNavigate();
    const [trip] = useState({
      name: "My Trip",
      dates: "October 5 - October 15",
      image: "https://source.unsplash.com/600x300/?cityscape"
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

  return (


    <div className="profile-container">

      <header className="trip-header">
        <div className="header-content">
          <div className="logo">Yaad Quest</div>
          <nav className="nav-links">
            <a href="#">Home</a>
            <a href="#">Explore</a>
            <a href="#">Activities</a>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
          </nav>
          <div className="avatar"></div>
          <button onClick={handleLogout}>logout</button>
        </div>
      </header>
      <div>

    <div className="content-body">
      <aside className="sidebar">
        <img src={profileImage} alt="User" className="profile-pic" />
        <h2>Welcome {user.username}</h2>
        <a href="#" className="edit-link">Edit Profile</a>

        <h3>Preferences</h3>
        <div className="preferences">
          <span>🏛️ Museums</span>
          <span>🎉 Festivals</span>
          <span>🍽️ Restaurants</span>
        </div>
        <Link to="/prefer">Edit Preferences</Link>

      </aside>

      <main className="main-content">
        <section className="my-trip">
          <img src={trip.image} alt="Trip" className="trip-image" />
          <div className="trip-details">
            <h2>{trip.name}</h2>
            <p>{trip.dates}</p>
            <button className="btn">View Itinerary</button>
          </div>
        </section>

        <section className="favorites">
          <h2>My Favorites</h2>
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

export default TravelProfilePage;
