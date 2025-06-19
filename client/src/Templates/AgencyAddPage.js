import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../css/AgencyProfilePage.css';

const API_BASE_URL = 'http://localhost:5001/api';

const AgencyProfilePage = () => {
  const { userId, token, userInfo,logout } = useAuth();
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [agencyInfo, setAgencyInfo] = useState(null);
  const [newDriver, setNewDriver] = useState({ driver_name: '', license_number: '' });
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [newStatus, setNewStatus] = useState('Available');
  const [newRate, setNewRate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`Fetching agency for user ${userId}`);

        // First try to get agency by user ID
        const agencyRes = await axios.get(`${API_BASE_URL}/agency/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (agencyRes.data) {
          console.log('Found agency:', agencyRes.data);
          setAgencyInfo(agencyRes.data);
          setNewRate(agencyRes.data.travel_rate?.toString() || '');

          // Now fetch drivers
          const driversRes = await axios.get(
            `${API_BASE_URL}/agency/${agencyRes.data.agency_id}/drivers`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDrivers(driversRes.data || []);
        } else {
          console.warn('No agency data returned');
          // Check if we have userInfo but no agency (new registration)
          if (userInfo?.userType === 'transport-agency') {
            setError('Please complete your agency registration');
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err.response?.data || err.message);
        if (err.response?.status === 404) {
          setError('Please register your transport agency first');
        } else {
          setError(err.response?.data?.error || 'Failed to load data');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchData();
    } else {
      navigate('/login');
    }
  }, [userId, token, navigate, userInfo]);


  const addDriver = async () => {
    try {
      if (!newDriver.driver_name || !newDriver.license_number) {
        throw new Error('Name and license number are required');
      }

      const response = await axios.post(
        `${API_BASE_URL}/agency/drivers`,
        {
          agency_id: agencyInfo.agency_id,
          ...newDriver
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDrivers([...drivers, {
        driver_id: response.data.driver_id,
        agency_id: agencyInfo.agency_id,
        driver_name: newDriver.driver_name,
        license_number: newDriver.license_number,
        driver_status: 'Available'
      }]);

      setNewDriver({ driver_name: '', license_number: '' });
      setSuccess('Driver added successfully!');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setSuccess(null);
    }
  };

  const updateDriverStatus = async () => {
    try {
      if (!selectedDriverId) {
        throw new Error('Please select a driver');
      }

      await axios.put(
        `${API_BASE_URL}/agency/drivers/${selectedDriverId}/status`,
        { driver_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDrivers(drivers.map(driver => 
        driver.driver_id == selectedDriverId 
          ? { ...driver, driver_status: newStatus } 
          : driver
      ));

      setSelectedDriverId('');
      setSuccess('Driver status updated!');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setSuccess(null);
    }
  };

  const deleteDriver = async (driverId) => {
    try {
      if (!window.confirm('Are you sure you want to delete this driver?')) return;

      await axios.delete(
        `${API_BASE_URL}/agency/drivers/${driverId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDrivers(drivers.filter(d => d.driver_id !== driverId));
      setSuccess('Driver deleted successfully!');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete driver');
      setSuccess(null);
    }
  };

const updateTravelRate = async () => {
  try {
    const rate = parseFloat(newRate);
    if (isNaN(rate)) {
      throw new Error('Please enter a valid number');
    }

    const response = await axios.put(
      `${API_BASE_URL}/agency/${agencyInfo.agency_id}/rate`,
      { travel_rate: rate },  // Must match backend expectation
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' // Crucial header
        }
      }
    );

    if (response.data.success) {
      setAgencyInfo(prev => ({ ...prev, travel_rate: rate }));
      setSuccess(`Rate updated to $${rate}/km`);
      setNewRate("");
    }
  } catch (err) {
    setError(err.response?.data?.error || 'Update failed');
    console.error('Update error:', err.response?.data || err.message);
  }
};
const handleLogout = () => {
    logout();
    navigate('/login');
  };
  // Clear messages after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, success]);

  if (loading) {
    return <div className="loading">Loading agency data...</div>;
  }

  if (!agencyInfo) {
    return (
      <div className="agency-container">
        <div className="no-agency">
          <h2>Welcome, {userInfo?.username || 'Transport Agency Owner'}!</h2>
          <p>You need to register your transport agency to continue.</p>
          
          <div className="agency-info-preview">
            <p><strong>Registered Email:</strong> {userInfo?.email}</p>
            <p><strong>Account Type:</strong> Transport Agency</p>
          </div>

          <Link to="/agency-registration" className="btn primary">
            Complete Agency Registration
          </Link>
          
          <p className="support-text">
            Having issues? Contact support at support@yaadquest.com
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="agency-container">
      <header className="trip-header">
        <div className="header-content">
          <div className="logo">Yaad Quest</div>
          <nav className="nav-links">
            <Link to="#">Home</Link>
            <Link to="/search">Explore</Link>
           
          </nav>
          <div className="avatar"></div>
          <button onClick={handleLogout}>logout</button>
        </div>
      </header>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="content-body">
        <aside className="sidebar">
          <div className="agency-info">
            <h2>{agencyInfo.company_name}</h2>
            <p>Travel Rate: ${agencyInfo.travel_rate}/km</p>
            <p>Total Drivers: {drivers.length}</p>
          </div>

          <div className="form-group">
            <h3>Update Travel Rate</h3>
            <input
              type="number"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              placeholder="New rate per km"
            />
            <button className="btn" onClick={updateTravelRate}>
              Update Rate
            </button>
          </div>

          <div className="form-group">
            <h3>Add New Driver</h3>
            <input
              type="text"
              value={newDriver.driver_name}
              onChange={(e) => setNewDriver({ ...newDriver, driver_name: e.target.value })}
              placeholder="Driver name"
            />
            <input
              type="text"
              value={newDriver.license_number}
              onChange={(e) => setNewDriver({ ...newDriver, license_number: e.target.value })}
              placeholder="License number"
            />
            <button className="btn" onClick={addDriver}>
              Add Driver
            </button>
          </div>

          <div className="form-group">
            <h3>Update Driver Status</h3>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
            >
              <option value="">Select Driver</option>
              {drivers.map((driver) => (
                <option key={driver.driver_id} value={driver.driver_id}>
                  {driver.driver_name}
                </option>
              ))}
            </select>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="Off Duty">Off Duty</option>
            </select>
            <button
              className="btn"
              onClick={updateDriverStatus}
              disabled={!selectedDriverId}
            >
              Update Status
            </button>
          </div>
        </aside>

        <main className="main-content">
          <h2>Welcome {userId.username}</h2>
          <h2>Driver Management</h2>
          
          <div className="drivers-grid">
            {drivers.length === 0 ? (
              <p>No drivers found</p>
            ) : (
              drivers.map((driver) => (
                <div key={driver.driver_id} className="driver-card">
                  <div className="driver-avatar">
                    {driver.driver_name.charAt(0)}
                  </div>
                  <div className="driver-info">
                    <h3>{driver.driver_name}</h3>
                    <p>
                      <strong>License:</strong> {driver.license_number}
                    </p>
                    <p>
                      <strong>Status:</strong> {driver.driver_status}
                    </p>
                  </div>
                  <button
                    className="btn delete"
                    onClick={() => deleteDriver(driver.driver_id)}
                  >
                    Remove Driver
                  </button>
                </div>
              ))
            )}
          </div>
          <footer className="footer">
              <div>
                <h3>Company</h3>
                <p>About Us</p>
              </div>
              <div>
                <h3>Contact</h3>
                <p>yaadquest@gmail.com</p>
              </div>
              <div>
                <h3> <a href="/search">Explore other businesses</a></h3>
                <p><a href="/search"> Search</a></p>
              </div>
              
            </footer>
        </main>
      </div>
    </div>
  );
};

export default AgencyProfilePage;