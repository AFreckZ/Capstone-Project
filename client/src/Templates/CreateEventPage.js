// CreateEventPage.js
import React, { useState } from "react";
import axios from 'axios';
import "../css/CreateEventPage.css";
import JamaicanAddressForm from "./JamaicanAddressForm";



export default function CreateEventPage() {
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [cost, setCost] = useState("");
  const [menuImage, setMenuImage] = useState(null);
  const [flyerImage, setFlyerImage] = useState(null);
  const [itineraryFile, setItineraryFile] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dateSchedule, setDateSchedule] = useState([]);

  const handleAddDateSchedule = () => {
    if (selectedDate && startTime && endTime) {
      setDateSchedule([...dateSchedule, { date: selectedDate, startTime, endTime }]);
      setSelectedDate("");
      setStartTime("");
      setEndTime("");
    }
  };

  const handleCreateEvent = () => {
    const eventData = {
      name,
      eventType,
      address,
      description,
      duration,
      cost,
      dateSchedule,
    };

    console.log("Event Created:", eventData);
    alert(`Event Created:\n${JSON.stringify(eventData, null, 2)}`);
  };

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
        <button className="back-button">⟵ Back</button>
        <div className="banner-content">
          <h1>Create Event</h1>
          <p>Enter the details for your events</p>
        </div>
      </div>
      
      <div className="event-form">
        <div className="form-group">
          <label>Event Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Event Type:</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="">Select an event type</option>
            <option value="Concert">Concert</option>
            <option value="Festival">Festival</option>
            <option value="Food Fair">Food Fair</option>
            <option value="Cultural Show">Cultural Show</option>
            <option value="Tour">Tour</option>
            <option value="Beach Party">Beach Party</option>
            <option value="Community Market">Community Market</option>
            <option value="Wellness Retreat">Wellness Retreat</option>
            <option value="Nightlife">Nightlife</option>
            <option value="Other">Other</option>
          </select>

          {["Food Fair", "Restaurant"].includes(eventType) && (
            <div className="form-group">
              <label>Upload Menu (Image):</label>
              <input type="file" accept="image/*" onChange={(e) => setMenuImage(e.target.files[0])} />
            </div>
          )}

          {["Concert", "Festival", "Nightlife"].includes(eventType) && (
            <div className="form-group">
              <label>Upload Flyer or Line-up (Image):</label>
              <input type="file" accept="image/*" onChange={(e) => setFlyerImage(e.target.files[0])} />
            </div>
          )}

          {["Tour", "Wellness Retreat"].includes(eventType) && (
            <div className="form-group">
              <label>Upload Itinerary (PDF or DOCX):</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setItineraryFile(e.target.files[0])} />
            </div>
          )}

          {eventType === "Other" && (
            <input
              type="text"
              placeholder="Enter custom event type"
              onChange={(e) => setEventType(e.target.value)}
            />
          )}
        </div>

        <JamaicanAddressForm onAddressChange={setAddress} />

        <div className="form-group">
          <label>Description:</label>
          <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Cost (JMD):</label>
          <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
        </div>


        {/* Excursion Date Schedule */}
        <div className="form-group excursion-section">
  <label>Event Date and Time:</label>
  <div className="excursion-inputs">
    <input
      type="date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
    />
    <input
      type="time"
      value={startTime}
      onChange={(e) => setStartTime(e.target.value)}
    />
    <input
      type="time"
      value={endTime}
      onChange={(e) => setEndTime(e.target.value)}
    />
    <button onClick={handleAddDateSchedule}>Add</button>
  </div>

  <ul className="excursion-list">
    {dateSchedule.map((item, index) => (
      <li key={index}>
        {item.date} – {item.startTime} to {item.endTime}
      </li>
    ))}
  </ul>
</div>


        <div className="action-buttons">
          <button className="finish-button" onClick={handleCreateEvent}>Create Event</button>
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
