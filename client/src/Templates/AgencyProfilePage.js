import React, { useState } from 'react';
import '../css/AgencyProfilePage.css';

const AgencyProfilePage = () => {
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'John Doe', license: 'JD123', status: 'Available' },
    { id: 2, name: 'Jane Smith', license: 'JS456', status: 'On Trip' }
  ]);

  const [newDriver, setNewDriver] = useState({ name: '', license: '' });
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [newStatus, setNewStatus] = useState('Available');

  const addDriver = () => {
    if (!newDriver.name || !newDriver.license) return;
    const newId = Date.now();
    setDrivers([...drivers, { ...newDriver, id: newId, status: 'Available' }]);
    setNewDriver({ name: '', license: '' });
  };

  const deleteDriver = (id) => {
    setDrivers(drivers.filter(driver => driver.id !== id));
  };

  const updateDriverStatus = () => {
    setDrivers(drivers.map(driver =>
      driver.id === Number(selectedDriverId)
        ? { ...driver, status: newStatus }
        : driver
    ));
  };

  return (
    <div className="agency-container">
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
          <h2>Add Driver</h2>
          <input
            type="text"
            placeholder="Name"
            value={newDriver.name}
            onChange={e => setNewDriver({ ...newDriver, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="License #"
            value={newDriver.license}
            onChange={e => setNewDriver({ ...newDriver, license: e.target.value })}
          />
          <button className="btn" onClick={addDriver}>Add Driver</button>

          <hr style={{ margin: '20px 0' }} />

          <h3>Set Driver Status</h3>
          <select onChange={(e) => setSelectedDriverId(e.target.value)} value={selectedDriverId}>
            <option value="">Select Driver</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>{driver.name}</option>
            ))}
          </select>
          <select onChange={(e) => setNewStatus(e.target.value)} value={newStatus}>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Off Duty">Off Duty</option>
          </select>
          <button className="btn" onClick={updateDriverStatus} disabled={!selectedDriverId}>Update Status</button>
        </aside>

        <main className="main-content">
          <section className="drivers-section">
            <h2>Drivers</h2>
            <div className="drivers-grid">
              {drivers.map(driver => (
                <div key={driver.id} className="driver-card">
                  <div className="driver-details">
                    <h3>{driver.name}</h3>
                    <p>License: {driver.license}</p>
                    <p>Status: {driver.status}</p>
                    <button className="btn" onClick={() => deleteDriver(driver.id)}>Delete</button>
                  </div>
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
  );
};

export default AgencyProfilePage;
