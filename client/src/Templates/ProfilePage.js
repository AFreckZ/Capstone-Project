import React, { useState } from 'react';
import '../css/ProfilePage.css';
import profileImage from '../images/sunset.jpg'; // Replace with real asset

const ProfilePage = () => {
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
        </div>
      </header>
    <div className="content-body">
      <aside className="sidebar">
        <img src={profileImage} alt="User" className="profile-pic" />
        <h2>Mary Jane</h2>
        <a href="#" className="edit-link">Edit Profile</a>

        <h3>Preferences</h3>
        <div className="preferences">
          <span>🏛️ Museums</span>
          <span>🎉 Festivals</span>
          <span>🍽️ Restaurants</span>
        </div>
        <a href="#" className="edit-link">Edit Preferences</a>

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
  );
};

export default ProfilePage;
