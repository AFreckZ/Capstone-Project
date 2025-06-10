// InterestPage.js
import React, { useState } from "react";
import "../css/Preferences.css";
import { useNavigate} from "react-router-dom";

// list of preference types
const categories = [
  "Concert",
  "Party",
  "Festival",
  "Sport",
  "Art/Talent",
  "Outdoor Adventure",
  "Indoor Adventure",
  "Museum/Historical Site",
  "Local Food/Dining",
  "Unique Food/Dining",
  "Club/Bar/Party",
  "Live Music"
];

export default function InterestPage() {
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '', visible: false });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toggleSelection = (category) => {
    if (message.visible) {
      setMessage({ text: '', type: '', visible: false });
    }
    
    const index = selected.indexOf(category);
    if (index > -1) {
      const newSelected = [...selected];
      newSelected.splice(index, 1);
      setSelected(newSelected);
    } else {
      setSelected([...selected, category]);
    }
  };

  const getBadgeNumber = (category) => {
    const index = selected.indexOf(category);
    return index > -1 ? index + 1 : null;
  };
  const showMessage = (text, type) => {
    setMessage({ text, type, visible: true });
    if (type === 'success') {
      setTimeout(() => {
        setMessage({ text: '', type: '', visible: false });
      }, 5000);
    }
  };

const handleSavePreferences = async () => {
  const selectedPrefs = selected;
  const total = selectedPrefs.length;

    if (total === 0) {
      showMessage("Please select at least one preference before saving.", "error");
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '', visible: false });


  // Create weighted preferences: first selected gets highest weight
  const weightedPrefs = selectedPrefs.map((tag, index) => ({
    tag,
    weight: total - index,
  }));

    console.log("Sending preferences:", JSON.stringify(weightedPrefs, null, 2));

  try {
    const response = await fetch("http://localhost:5001/api/prefer/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add auth token or user ID if needed
      },
      body: JSON.stringify({ preferences: weightedPrefs }),
    });

    const result = await response.json();

     if (response.ok) {
      console.log("Preferences saved:", result);
      showMessage(
        `Your preferences has been saved`, 
          "success"
      );
      navigate('/generate');
      // Optionally redirect after successful save
      // setTimeout(() => window.location.href = '/dashboard', 2000);
    } else {
      console.error("Failed to save preferences:", response.status);
      showMessage(
        result.error || 'Failed to save preferences. Please try again.', 
          "error"
        );
    }
  } catch (error) {
    console.error("Error saving preferences:", error);
          showMessage(
        "Network error: Could not connect to server. Please check your connection and try again.", 
        "error"
      );
    } finally {
      setIsLoading(false);
  }
};
  return (
    <div className="interest-container">
      <header className="interest-header">
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

      <div className="hero-image">
        <h1>Choose Your Preferences</h1>
      </div>
      <div className="instructions">
        <p>Please select the types of events and venues that you would like to visit.</p>
      
      </div>
         {message.visible && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      <div className="category-grid">
       
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => toggleSelection(category)}
            className={`category-item ${selected.includes(category) ? "selected" : ""}`}
          >
            {getBadgeNumber(category) && (
              <span className="badge">{getBadgeNumber(category)}</span>
            )}
            <span className="category-label">{category}</span>
          </div>
        ))}
      </div>

      <div className="save-button-wrapper" onClick={handleSavePreferences}>
        <button className="save-button" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Preferences →'}</button>
         
      </div>

      <footer className="interest-footer">
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
            <p>Activities</p>
            <p>Restaurants</p>
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
