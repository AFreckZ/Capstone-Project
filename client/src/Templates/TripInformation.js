// TripInformationPage.js
import React, { useState } from "react";
import "../css/TripInformation.css";
import JamaicanAddressForm from "./JamaicanAddressForm";

export default function TripInformationPage() {
  const [needTransport, setNeedTransport] = useState(true);
  const [location, setAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [itineraryStart, setItineraryStart] = useState("");
  const [itineraryEnd, setItineraryEnd] = useState("");
  const [preferStarttime, setPreferStartTime]= useState("");
  const [preferEndtime, setPreferEndTime]= useState("");



  const convertToJMD = () => {
    const rate = exchangeRates[currency] || 1;
    const result = amount * rate;
    return result.toLocaleString('en-JM', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  

  const exchangeRates = {
    USD: 155,
    CAD: 115,
    GBP: 200,
    EUR: 170,
    JMD: 1,
  };

  const parishes = [
    "Kingston", "St. Andrew", "St. Thomas", "Portland", "St. Mary",
    "St. Ann", "Trelawny", "St. James", "Hanover", "Westmoreland",
    "St. Elizabeth", "Manchester", "Clarendon"
  ];

  const preferences = [
    "Nature",
    "Food",
    "Restaurant",
    "Building",
    "Fun",
    "Museums",
    "Festivals",
    "Technology"
  ];

  return (
    <div className="trip-container">
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
        <h1>Trip Information</h1>
        <p>Input your travel preferences below to start building your itinerary.</p>
      </div>

      <div className="trip-form">
      

        <div className="form-group">
          <label>Location of Stay:</label>
          <JamaicanAddressForm onAddressChange={setAddress} />
        </div>

        <div className="form-group date-inputs">
          <div>
            <label htmlFor="startDate">Trip Start Date:</label>
            <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label htmlFor="endDate">Trip End Date:</label>
            <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          
        </div>
        <div className="form-group date-inputs">
  
  <div>
    <label htmlFor="itineraryEnd">Preferred Activity Start Date:</label>
    <input
      id="itineraryStart"
      type="date"
      value={itineraryStart}
      onChange={(e) => setItineraryStart(e.target.value)}
    />
  </div>
  <div>
    <label htmlFor="itineraryEnd">Preferred Activity End Dates:</label>
    <input
      id="itineraryEnd"
      type="date"
      value={itineraryEnd}
      onChange={(e) => setItineraryEnd(e.target.value)}
    />
  </div>
  <br></br>
  <div>
    <label htmlFor="preferStarttime">Preferred Activity Start Time:</label>
    <input
      id="preferStarttime"
      type="time"
      value={preferStarttime}
      onChange={(e) => setPreferStartTime(e.target.value)}
    />
  </div>
  
  <div>
    <label htmlFor="preferEndtime">Preferred Activity End Time:</label>
    <input
      id="preferEndtime"
      type="time"
      value={preferEndtime}
      onChange={(e) => setPreferEndTime(e.target.value)}
    />
  </div>
</div>





        <div className="budget-input-section">
      <label htmlFor="budget">Enter Budget:</label>
      <div className="budget-row">
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD ($)</option>
          <option value="CAD">CAD (C$)</option>
          <option value="GBP">GBP (£)</option>
          <option value="EUR">EUR (€)</option>
          <option value="JMD">JMD (J$)</option>
        </select>
        <input
          type="number"
          id="budget"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>
      <div className="converted-budget">
        ≈ {convertToJMD()} JMD
      </div>
    </div>

        
        <div className="form-group">
                <label>Will You Need Transport:</label>
                <button className="toggle-button" onClick={() => setNeedTransport(!needTransport)}>
                  {needTransport ? "✔️" : "❌"}
                </button>
              </div>
        <div className="action-buttons">
          <button className="finish-button">Finished</button>
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
