import React from 'react';
import '../css/About.css';
const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>About Yaad Quest</h1>
        <p>
          Your all-in-one Jamaican travel companion—bridging tourists and local experiences through smart
          planning, safety, and discovery.
        </p>
      </div>

      <div className="about-section">
        <h2>Our Mission</h2>
        <p>
          Yaad Quest is a comprehensive Jamaican trip planning platform designed to address the challenges
          tourists face when visiting the island. By offering personalized itineraries, trusted local
          connections, and real-time insights, we empower visitors to explore Jamaica confidently while
          supporting local businesses and boosting tourism growth.
        </p>
      </div>

      <div className="about-section">
        <h2>Main Features</h2>
        <ul className="feature-list">
          <li>
            <strong>🎯 Personalized Itinerary Creation</strong><br />
            Tailored trip plans based on user preferences, budget, and flight info.
          </li>
          <li>
            <strong>📍 Location-Based Services</strong><br />
            Discover nearby venues and hidden gems, with route optimization.
          </li>
          <li>
            <strong>🚐 Transportation Safety Network</strong><br />
            Connect with vetted, secure transport providers across the island.
          </li>
          <li>
            <strong>🛡 Business Verification System</strong><br />
            Ministry-approved service listings to ensure compliance and safety.
          </li>
          <li>
            <strong>📚 Information Hub</strong><br />
            Explore venue details, live events, and real-time updates.
          </li>
          <li>
            <strong>💡 Smart Recommendations</strong><br />
            Get suggestions tailored to your interests, time of day, and budget.
          </li>
        </ul>
      </div>

      <div className="about-section">
        <h2>Why Yaad Quest?</h2>
        <p>
          Jamaica is rich in culture, adventure, and hospitality—but tourists often struggle to connect
          with the best local experiences. Yaad Quest fills this gap by combining reliable information,
          personalized planning, and a secure ecosystem for exploring the island.
        </p>
      </div>

      <div className="about-footer">
        <p>&copy; {new Date().getFullYear()} Yaad Quest. All rights reserved.</p>
      </div>
    </div>
  );
};

export default About;
