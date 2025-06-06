// InterestPage.js
import React, { useState } from "react";
import "../css/Preferences.css";



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

  const toggleSelection = (category) => {
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


const handleSavePreferences = async () => {
  const selectedPrefs = selected;
  const total = selectedPrefs.length;

  // Create weighted preferences: first selected gets highest weight
  const weightedPrefs = selectedPrefs.map((tag, index) => ({
    tag,
    weight: total - index,
  }));

  console.log(JSON.stringify(weightedPrefs, null, 2));

  // Send weighted preferences JSON to backend
  try {
    const response = await fetch("http://localhost:5001/api/prefer/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add auth token or user ID if needed
      },
      body: JSON.stringify({ preferences: weightedPrefs }),
    });


     if (response.ok) {
      const result = await response.json();
      console.log("Preferences saved:", result);
      // You can show a success message or redirect here
    } else {
      console.error("Failed to save preferences:", response.status);
    }
  } catch (error) {
    console.error("Error saving preferences:", error);
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
        <button className="save-button" >Save Preferences →</button>
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
