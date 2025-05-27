// CreateEventPage.js
import React, { useState } from "react";
import axios from 'axios';
import "../css/CreateEventPage.css";

export default function CreateEventPage() {
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [cost, setCost] = useState("");
  const [schedule, setSchedule] = useState("");

  return (
    <div className="event-container">
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

      <div className="trip-banner">
        <div className="back-button">⟵ BACK</div>
        <h1>Create Event</h1>
        <p>Enter the details for your new event</p>
      </div>

      <div className="event-form">
        <div className="form-group">
          <label>Event Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Event Type:</label>
          <input type="text" value={eventType} onChange={(e) => setEventType(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Duration (in hours):</label>
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Cost (JMD):</label>
          <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Schedule Hours:</label>
          <input type="text" placeholder="e.g. 9AM - 5PM" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
        </div>

        <div className="action-buttons">
          <button className="finish-button">Create Event</button>
          <button className="cancel-button">Cancel</button>
        </div>
      </div>

      <footer className="trip-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">Yaad Quest</div>
          </div>
          <div className="footer-section">
            <h3>Company</h3>
            <p>About Us</p>
            <h3>Contact</h3>
            <p>Email</p>
          </div>
          <div className="footer-section">
            <h3>Further</h3>
            <p>Events</p>
            <p>Experiences</p>
            <div className="footer-icons">
              <div className="icon pink"></div>
              <div className="store-badge">Google Play</div>
              <div className="store-badge">App Store</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
