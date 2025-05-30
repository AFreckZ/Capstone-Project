// CreateVenuePage.js
import React, { useState } from "react";
import "../css/CreateEventPage.css";
import JamaicanAddressForm from "./JamaicanAddressForm";

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const hours = Array.from({ length: 24 }, (_, i) =>
  `${i === 0 ? 12 : i > 12 ? i - 12 : i}:00 ${i < 12 ? "AM" : "PM"}`
);

const initialSchedule = daysOfWeek.reduce((acc, day) => {
  acc[day] = { open: "", close: "", isClosed: false };
  return acc;
}, {});

function WeeklySchedule({ schedule, setSchedule }) {
  const handleChange = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const toggleClosed = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], isClosed: !prev[day].isClosed, open: "", close: "" }
    }));
  };

  return (
    <div className="weekly-schedule">
      <label>Weekly Operating Hours:</label>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Open</th>
            <th>Close</th>
            <th>Closed</th>
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map(day => (
            <tr key={day}>
              <td>{day}</td>
              <td>
                <select
                  value={schedule[day].open}
                  onChange={(e) => handleChange(day, "open", e.target.value)}
                  disabled={schedule[day].isClosed}
                >
                  <option value="">--</option>
                  {hours.map(hour => (
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={schedule[day].close}
                  onChange={(e) => handleChange(day, "close", e.target.value)}
                  disabled={schedule[day].isClosed}
                >
                  <option value="">--</option>
                  {hours.map(hour => (
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={schedule[day].isClosed}
                  onChange={() => toggleClosed(day)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CreateVenuePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [venueType, setVenueType] = useState("");
  const [cost, setCost] = useState("");
  const [schedule, setSchedule] = useState(initialSchedule);
  const [dateSchedule, setDateSchedule] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleAddDateSchedule = () => {
    if (selectedDate && startTime && endTime) {
      setDateSchedule([...dateSchedule, { date: selectedDate, startTime, endTime }]);
      setSelectedDate("");
      setStartTime("");
      setEndTime("");
    }
  };

  const handleCreateVenue = () => {
    const venueData = {
      name,
      description,
      address,
      venueType,
      cost,
      schedule,
      dateSchedule,
    };

    console.log("Venue Created:", venueData);
    alert(`Venue Created:\n${JSON.stringify(venueData, null, 2)}`);
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
          <h1>Create Venue</h1>
          <p>Enter the details for your venue</p>
        </div>
      </div>


      <div className="event-form">
        <div className="form-group">
          <label>Venue Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <h3>Address:</h3>
        <JamaicanAddressForm onAddressChange={setAddress} />

        <div className="form-group">
          <label>Venue Type:</label>
          <input type="text" value={venueType} onChange={(e) => setVenueType(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Cost (JMD):</label>
          <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
        </div>

        <WeeklySchedule schedule={schedule} setSchedule={setSchedule} />

        <div className="form-group">
          <label>Excursion Schedule by Date:</label>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="Start Time" />
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="End Time" />
          <button onClick={handleAddDateSchedule}>Add Date Schedule</button>

          <ul>
            {dateSchedule.map((item, index) => (
              <li key={index}>{item.date} - {item.startTime} to {item.endTime}</li>
            ))}
          </ul>
        </div>

        <div className="action-buttons">
          <button className="finish-button" onClick={handleCreateVenue}>Create Venue</button>
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
