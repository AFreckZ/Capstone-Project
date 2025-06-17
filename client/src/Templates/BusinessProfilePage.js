// src/pages/BusinessProfilePage.js
import React, { useState } from "react";
import JamaicanAddressForm from "./JamaicanAddressForm";
import WeeklySchedule from "./WeeklySchedule";
import "../css/BusinessProfilePage.css";

export default function BusinessProfilePage() {
  /* ────────────────── STATE ────────────────── */
  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState({
    Monday: { open: "", close: "", isClosed: false },
    Tuesday: { open: "", close: "", isClosed: false },
    Wednesday: { open: "", close: "", isClosed: false },
    Thursday: { open: "", close: "", isClosed: false },
    Friday: { open: "", close: "", isClosed: false },
    Saturday: { open: "", close: "", isClosed: false },
    Sunday: { open: "", close: "", isClosed: false },
  });
  const [logo, setLogo] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [services, setServices] = useState([
    { id: 1, name: "Catamaran Cruise", price: 120, description: "Half‑day cruise with snorkeling." },
    { id: 2, name: "Blue Lagoon Tour", price: 95, description: "Guided tour of the famous lagoon." },
  ]);
  const [newService, setNewService] = useState({ name: "", price: "", description: "" });

  /* ────────────────── HANDLERS ────────────────── */
  const addService = (e) => {
    e.preventDefault();
    if (!newService.name.trim()) return;
    setServices([...services, { ...newService, id: Date.now() }]);
    setNewService({ name: "", price: "", description: "" });
  };

  const deleteService = (id) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    const data = {
      name,
      businessType,
      address,
      description,
      schedule,
      logo,
      contact: { email, phone },
      services,
    };
    console.log("Business profile:", data);
    alert(`Business profile saved:\n${JSON.stringify(data, null, 2)}`);
  };

  /* ────────────────── RENDER ────────────────── */
  return (
    <div className="business-container">
      {/* Header */}
      <header className="business-header">
        <div className="header-content">
          <div className="logo">Yaad Quest</div>
          <nav className="nav-links">
            <a href="#">Home</a>
            <a href="#">Businesses</a>
            <a href="#">Events</a>
            <a href="#">About</a>
          </nav>
        </div>
      </header>

      {/* Banner */}
      <div className="trip-banner">
        <button className="back-button">⟵ Back</button>
        <div className="banner-content">
          <h1>Create Business Profile</h1>
          <p>Register your business on Yaad Quest</p>
        </div>
      </div>

      {/* Form body */}
      <div className="business-form">
        {/* Basic info */}
        <div className="form-group">
          <label>Business Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Type of Business:</label>
          <select value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
            <option value="">Select type</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Hotel">Hotel</option>
            <option value="Tour Service">Tour Service</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Retail">Retail</option>
            <option value="Other">Other</option>
          </select>
          {businessType === "Other" && (
            <input
              placeholder="Specify type"
              onChange={(e) => setBusinessType(e.target.value)}
            />
          )}
        </div>

        {/* Address */}
        <JamaicanAddressForm onAddressChange={setAddress} />

        {/* Description */}
        <div className="form-group">
          <label>Description:</label>
          <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* Weekly hours */}
        <WeeklySchedule schedule={schedule} setSchedule={setSchedule} />

        {/* Logo upload & contacts */}
        <div className="form-group">
          <label>Upload Logo:</label>
          <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Phone:</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        {/* Service manager */}
        <section className="services-section">
          <h2>Services</h2>

          <form className="add-service-form" onSubmit={addService}>
            <input
              placeholder="Service Name"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price ($)"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            />
            <input
              placeholder="Description"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            />
            <button type="submit" className="btn">Add</button>
          </form>

          <div className="services-grid">
            {services.map((svc) => (
              <div key={svc.id} className="service-card">
                <h3>{svc.name}</h3>
                <p className="price">${svc.price}</p>
                <p>{svc.description}</p>
                <button className="btn delete-btn" onClick={() => deleteService(svc.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Action buttons */}
        <div className="action-buttons">
          <button className="finish-button" onClick={handleSave}>Save Business</button>
          <button className="cancel-button">Cancel</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="trip-footer">
        <div className="footer-content">
          <div className="footer-section"><div className="footer-logo">Yaad Quest</div></div>
          <div className="footer-section">
            <h3>Company</h3><p>About Us</p>
            <h3>Contact</h3><p>Email</p>
          </div>
          <div className="footer-section">
            <h3>Discover</h3><p>Events</p><p>Experiences</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
