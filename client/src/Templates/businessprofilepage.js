import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../css/businessprofile.css';
import profileImage from '../images/sunset.jpg';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const BusinessProfilePage = () => {
  const { user, userId, userType, loading, isAuthenticated, logout, token, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  
  // State for venues and events
  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch venues and events for the business owner
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!userId || !isAuthenticated) return;
      
      try {
        setDataLoading(true);
        
        console.log('Fetching data for userId:', userId);
        
        // Build the URLs - using absolute URL to match your AuthContext
        const venuesUrl = `http://localhost:5001/api/business/venues/${userId}`;
        const eventsUrl = `http://localhost:5001/api/business/events/${userId}`;
        console.log('Venues URL:', venuesUrl);
        console.log('Events URL:', eventsUrl);
        console.log('Token exists:', !!token);
        console.log('Token value:', token);
        
        // Fetch venues
        const venuesResponse = await fetch(venuesUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Venues response status:', venuesResponse.status);
        console.log('Venues response URL:', venuesResponse.url);
        console.log('Venues content-type:', venuesResponse.headers.get('content-type'));
        
        if (venuesResponse.ok) {
          // Check content type before parsing
          const contentType = venuesResponse.headers.get('content-type');
          console.log('Content type:', contentType);
          
          if (contentType && contentType.includes('application/json')) {
            const venuesData = await venuesResponse.json();
            console.log('Venues data:', venuesData);
            setVenues(venuesData);
          } else {
            // Not JSON - log what we got instead
            const responseText = await venuesResponse.text();
            console.log('Non-JSON response (first 500 chars):', responseText.substring(0, 500));
            setError('Server returned HTML instead of JSON for venues');
          }
        } else {
          // Log the actual response when it's not ok
          const errorText = await venuesResponse.text();
          console.log('Venues error response:', errorText.substring(0, 500) + '...');
          setError(`Failed to fetch venues: ${venuesResponse.status} ${venuesResponse.statusText}`);
        }
        
        // Fetch events
        const eventsResponse = await fetch(eventsUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Events response status:', eventsResponse.status);
        console.log('Events response URL:', eventsResponse.url);
        console.log('Events content-type:', eventsResponse.headers.get('content-type'));
        
        if (eventsResponse.ok) {
          // Check content type before parsing
          const contentType = eventsResponse.headers.get('content-type');
          
          if (contentType && contentType.includes('application/json')) {
            const eventsData = await eventsResponse.json();
            console.log('Events data:', eventsData);
            setEvents(eventsData);
          } else {
            // Not JSON - log what we got instead
            const responseText = await eventsResponse.text();
            console.log('Non-JSON events response (first 500 chars):', responseText.substring(0, 500));
            setError('Server returned HTML instead of JSON for events');
          }
        } else {
          // Log the actual response when it's not ok
          const errorText = await eventsResponse.text();
          console.log('Events error response:', errorText.substring(0, 500) + '...');
          setError(`Failed to fetch events: ${eventsResponse.status} ${eventsResponse.statusText}`);
        }
        
      } catch (err) {
        console.error('Error fetching business data:', err);
        setError(`Failed to load your venues and events: ${err.message}`);
      } finally {
        setDataLoading(false);
      }
    };

    fetchBusinessData();
  }, [userId, isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  // Show message if user data is not available
  if (!user) {
    return <div>User data not available. Please try logging in again.</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const addEvent = () => {
    navigate('/EVregister');
  };

  const handleEditVenue = (venueId) => {
    navigate(`/venues/edit/${venueId}`);
  };

  const handleEditEvent = (eventId) => {
    navigate(`/events/edit/${eventId}`);
  };

  const handleDeleteVenue = async (venueId) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      try {
        const response = await fetch(`http://localhost:5001/api/business/venue/${venueId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        if (response.ok) {
          setVenues(venues.filter(venue => venue.venue_id !== venueId));
        }
      } catch (err) {
        console.error('Error deleting venue:', err);
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`http://localhost:5001/api/business/event/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        if (response.ok) {
          setEvents(events.filter(event => event.event_id !== eventId));
        }
      } catch (err) {
        console.error('Error deleting event:', err);
      }
    }
  };

  const handleToggleVenueStatus = async (venueId, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const response = await fetch(`http://localhost:5001/api/business/venue/${venueId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: newStatus })
      });
      
      if (response.ok) {
        setVenues(venues.map(venue => 
          venue.venue_id === venueId 
            ? { 
                ...venue, 
                is_active: newStatus,
                status_text: newStatus === 1 ? 'active' : 'inactive'
              }
            : venue
        ));
      }
    } catch (err) {
      console.error('Error updating venue status:', err);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    return timeString.slice(0, 5); // Format HH:MM from HH:MM:SS
  };

  const formatDaysOpen = (daysJson) => {
    if (!daysJson) return 'Not specified';
    try {
      const days = JSON.parse(daysJson);
      return Array.isArray(days) ? days.join(', ') : daysJson;
    } catch {
      return daysJson;
    }
  };

  return (
    <div className="profile-container">
      <header className="trip-header">
        <div className="header-content">
          <div className="logo">Yaad Quest</div>
          <nav className="nav-links">
            <a href="/business-profile">Home</a>
            <a href="/search">Search</a>
            </nav>
          <div className="avatar"></div>
          <button onClick={handleLogout}>logout</button>
        </div>
      </header>
      
      <div>
        <div className="content-body">
          <aside className="sidebar">
            <img src={profileImage} alt="User" className="profile-pic" />
            <h2>Welcome {user.username}</h2>
          </aside>

          <main className="main-content">
            <section className="my-trip">
              <div className="trip-details">
                <h2>Register another venue / event for our tourists to enjoy.</h2>
                <button className="btn" onClick={addEvent}>Add another venue/Event</button>
              </div>
            </section>

            <section className="favorites">
              <h2>Your Venues ({venues.length})</h2>
              
              {dataLoading ? (
                <p>Loading your venues...</p>
              ) : error ? (
                <p className="error">{error}</p>
              ) : venues.length > 0 ? (
                <div className="venues-grid">
                  {venues.map((venue) => (
                    <div key={venue.venue_id} className="venue-card">
                      
                      <div className="venue-info">
                        <h3>{venue.name}</h3>
                        <p className="venue-type">
                          <strong>Type:</strong> {venue.venue_type}
                        </p>
                        <p className="venue-location">
                          <strong>Address:</strong> {venue.address}
                        </p>
                        <p className="venue-hours">
                          <strong>Hours:</strong> {formatTime(venue.opening_time)} - {formatTime(venue.closing_time)}
                        </p>
                        <p className="venue-days">
                          <strong>Days Open:</strong> {formatDaysOpen(venue.days_open)}
                        </p>
                        <p className="venue-cost">
                          <strong>Cost:</strong> ${venue.cost || 'Free'}
                        </p>
                        <p className="venue-description">{venue.description}</p>
                        <p className="venue-status">
                          Status: <span className={`status ${venue.status_text}`}>{venue.status_text}</span>
                        </p>
                        <div className="venue-actions">
                        
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>You haven't registered any venues yet. <button className="btn" onClick={addEvent}>Add your first venue</button></p>
              )}
            </section>

            <section className="favorites">
              <h2>Your Events ({events.length})</h2>
              
              {dataLoading ? (
                <p>Loading your events...</p>
              ) : error ? (
                <p className="error">{error}</p>
              ) : events.length > 0 ? (
                <div className="events-grid">
                  {events.map((event) => (
                    <div key={event.event_id} className="event-card">
                      <div className="event-image">
                        {event.flyer_image_path ? (
                          <img src={event.flyer_image_path} alt={event.name} />
                        ) : (
                          <div className="placeholder-image">
                            {event.event_type || 'Event'}
                          </div>
                        )}
                      </div>
                      <div className="event-info">
                        <h3>{event.name}</h3>
                        <p className="event-type">
                          <strong>Type:</strong> {event.event_type}
                        </p>
                        <p className="event-datetime">
                          <strong>Start:</strong> {formatDateTime(event.start_datetime)}
                        </p>
                        <p className="event-datetime">
                          <strong>End:</strong> {formatDateTime(event.end_datetime)}
                        </p>
                        <p className="event-location">
                          <strong>Location:</strong> {event.venue_location}
                        </p>
                        <p className="event-cost">
                          <strong>Cost:</strong> ${event.cost || 'Free'}
                        </p>
                        <p className="event-description">{event.description}</p>
                        {event.menu_image_path && (
                          <p className="event-menu">
                            <strong>Menu:</strong> 
                            <a href={event.menu_image_path} target="_blank" rel="noopener noreferrer">
                              View Menu
                            </a>
                          </p>
                        )}
                       
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>You haven't registered any events yet. <button className="btn" onClick={addEvent}>Add your first event</button></p>
              )}
            </section>

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
              </div>
              
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfilePage;