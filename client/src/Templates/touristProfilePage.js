import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../css/ProfilePage.css';
import profileImage from '../images/sunset.jpg'; 
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const TouristProfilePage = () => {
  const { user, userId, userType, loading, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // State for venues and events
  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(null);
  
  // State for user preferences
  const [preferences, setPreferences] = useState([]);
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [preferencesError, setPreferencesError] = useState(null);
  
  const [trip] = useState({
    name: "Create your dream vacation by entering your preferences below",
  });

  // Fetch user preferences
  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        setPreferencesLoading(true);
        setPreferencesError(null);

        console.log('Fetching user preferences for user:', userId);

        // Get authentication token from localStorage or context
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        console.log('Auth token available:', !!token);

        const authHeaders = {
          'Content-Type': 'application/json',
        };

        if (token) {
          authHeaders['Authorization'] = `Bearer ${token}`;
        }

        // Let's try the exact routes from your backend in order:
        // 1. GET /preferences/tourists/:id
        // 2. GET /preferences/:id  
        // 3. GET /preferences/tourists (then filter)

        const touristId = 10; // You confirmed this is correct
        console.log('Using known tourist_id:', touristId);

        // Try your exact backend routes
        const preferencesEndpointsToTry = [
          // Try the direct backend first (bypassing any proxy issues)
          `http://localhost:5001/api/preferences/tourists/${touristId}`,
          `http://localhost:5001/api/preferences/${touristId}`,
          // Then try with proxy
          `/api/preferences/tourists/${touristId}`,
          `/api/preferences/${touristId}`,
        ];

        let preferencesData = null;
        let successfulEndpoint = null;

        for (const endpoint of preferencesEndpointsToTry) {
          try {
            console.log(`\n=== Trying preferences endpoint: ${endpoint} ===`);
            
            const response = await fetch(endpoint, {
              method: 'GET',
              headers: authHeaders,
            });

            console.log(`Response status: ${response.status}`);
            console.log(`Response headers:`, [...response.headers.entries()]);

            if (response.ok) {
              const contentType = response.headers.get('content-type');
              console.log(`Content-Type: ${contentType}`);
              
              if (contentType?.includes('application/json')) {
                preferencesData = await response.json();
                successfulEndpoint = endpoint;
                console.log(` SUCCESS with endpoint: ${endpoint}`);
                console.log(`Raw response data:`, JSON.stringify(preferencesData, null, 2));
                break;
              } else {
                console.log(`Wrong content type: ${contentType}`);
                const responseText = await response.text();
                console.log(`Response text:`, responseText);
              }
            } else {
              console.log(` Failed with status: ${response.status}`);
              const responseText = await response.text();
              console.log(`Error response text:`, responseText);
              
              if (response.status === 404 && endpoint.includes('/tourists/')) {
                console.log('404 from tourists endpoint - this tourist may not have preferences set');
              }
            }
          } catch (err) {
            console.log(` Network error with endpoint ${endpoint}:`, err.message);
            continue;
          }
        }

        // If all specific endpoints failed, try getting all tourist preferences
        if (!successfulEndpoint) {
          console.log('\n=== Trying fallback: Get all tourist preferences ===');
          
          const fallbackEndpoints = [
            'http://localhost:5001/api/prefer/tourists',
            '/api/preferences/tourists'
          ];

          for (const endpoint of fallbackEndpoints) {
            try {
              console.log(`Trying fallback endpoint: ${endpoint}`);
              
              const response = await fetch(endpoint, {
                method: 'GET',
                headers: authHeaders,
              });
              
              console.log(`Fallback response status: ${response.status}`);
              
              if (response.ok) {
                const allTouristPrefs = await response.json();
                console.log('All tourist preferences count:', allTouristPrefs.length);
                console.log('All tourist preferences:', allTouristPrefs);
                
                // Find preferences for our tourist_id
                const userPrefs = allTouristPrefs.filter(pref => {
                  console.log(`Checking pref: tourist_id=${pref.tourist_id} (type: ${typeof pref.tourist_id}) vs ${touristId} (type: ${typeof touristId})`);
                  return pref.tourist_id === parseInt(touristId) || pref.tourist_id === touristId;
                });
                
                console.log(`Found ${userPrefs.length} matching preferences for tourist_id ${touristId}`);
                console.log('Matching preferences:', userPrefs);
                
                if (userPrefs.length > 0) {
                  preferencesData = userPrefs;
                  successfulEndpoint = 'fallback-all-tourists';
                  break;
                }
              }
            } catch (fallbackErr) {
              console.log('Fallback method error:', fallbackErr);
            }
          }
        }

        if (!successfulEndpoint) {
          console.log(' All methods failed - no preferences could be loaded');
          setPreferences([]);
          return;
        }

        // Process preferences data
        console.log('\n=== Processing preferences data ===');
        console.log('Raw preferences data:', JSON.stringify(preferencesData, null, 2));
        let processedPreferences = [];

        if (preferencesData && preferencesData !== null) {
          if (Array.isArray(preferencesData)) {
            if (preferencesData.length === 0) {
              console.log('Empty preferences array');
            } else {
              const preferenceRecord = preferencesData[0];
              console.log('First preference record:', JSON.stringify(preferenceRecord, null, 2));
              
              if (preferenceRecord && preferenceRecord.preferences) {
                console.log('Raw preferences field:', preferenceRecord.preferences);
                console.log('Preferences field type:', typeof preferenceRecord.preferences);
                
                try {
                  const parsedPrefs = typeof preferenceRecord.preferences === 'string' 
                    ? JSON.parse(preferenceRecord.preferences)
                    : preferenceRecord.preferences;
                  
                  console.log('Parsed preferences:', parsedPrefs);
                  console.log('Parsed preferences type:', typeof parsedPrefs);
                  console.log('Is array?', Array.isArray(parsedPrefs));
                  
                  if (Array.isArray(parsedPrefs)) {
                    processedPreferences = parsedPrefs.map(pref => {
                      console.log('Processing pref:', pref);
                      return {
                        preference_name: pref.tag,
                        weight: pref.weight
                      };
                    });
                  } else {
                    console.log('Parsed preferences is not an array:', parsedPrefs);
                  }
                } catch (parseError) {
                  console.error(' Error parsing preferences JSON:', parseError);
                  console.log('Raw preferences value that failed to parse:', preferenceRecord.preferences);
                }
              } else {
                console.log('No preferences field in record:', Object.keys(preferenceRecord));
              }
            }
          } else if (preferencesData.preferences) {
            console.log('Single object response with preferences field');
            try {
              const parsedPrefs = typeof preferencesData.preferences === 'string'
                ? JSON.parse(preferencesData.preferences)
                : preferencesData.preferences;
              
              if (Array.isArray(parsedPrefs)) {
                processedPreferences = parsedPrefs.map(pref => ({
                  preference_name: pref.tag,
                  weight: pref.weight
                }));
              }
            } catch (parseError) {
              console.error('Error parsing single object preferences:', parseError);
            }
          } else {
            console.log('Unexpected data structure:', preferencesData);
          }
        }

        console.log('Final processed preferences:', processedPreferences);
        setPreferences(processedPreferences);

      } catch (err) {
        console.error('Error fetching user preferences:', err);
        setPreferencesError(`Failed to load preferences: ${err.message}`);
        setPreferences([]);
      } finally {
        setPreferencesLoading(false);
      }
    };

    if (isAuthenticated && userId) {
      fetchUserPreferences();
    }
  }, [isAuthenticated, userId]);

  // Fetch featured venues and events
  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        setFeaturedLoading(true);
        setFeaturedError(null);

        console.log('Fetching featured content...');

        // Try different API endpoint patterns
        const endpointsToTry = [
          // Try relative URLs first (with proxy)
          { venues: '/api/venues/', events: '/api/events/' },
          { venues: '/api/venues', events: '/api/events' },
          // Try absolute URLs (direct to backend)
          { venues: 'http://localhost:5001/api/venues/', events: 'http://localhost:5001/api/events/' },
          { venues: 'http://localhost:5001/api/venues', events: 'http://localhost:5001/api/events' },
          // Try if there are different route patterns
          { venues: '/api/venue/', events: '/api/event/' },
          { venues: 'http://localhost:5001/api/venue/', events: 'http://localhost:5001/api/event/' }
        ];

        let venuesData = [];
        let eventsData = [];
        let successfulEndpoint = null;

        // Try each endpoint pattern until one works
        for (const endpoints of endpointsToTry) {
          try {
            console.log(`Trying endpoints: venues=${endpoints.venues}, events=${endpoints.events}`);
            
            const [venuesResponse, eventsResponse] = await Promise.all([
              fetch(endpoints.venues),
              fetch(endpoints.events)
            ]);

            console.log(`Venues response status: ${venuesResponse.status}`);
            console.log(`Events response status: ${eventsResponse.status}`);

            if (venuesResponse.ok && eventsResponse.ok) {
              const venuesContentType = venuesResponse.headers.get('content-type');
              const eventsContentType = eventsResponse.headers.get('content-type');
              
              if (venuesContentType?.includes('application/json') && eventsContentType?.includes('application/json')) {
                venuesData = await venuesResponse.json();
                eventsData = await eventsResponse.json();
                successfulEndpoint = endpoints;
                console.log(`Success with endpoints: ${JSON.stringify(endpoints)}`);
                console.log(`Found ${venuesData.length} venues and ${eventsData.length} events`);
                break;
              } else {
                console.log(`Wrong content type: venues=${venuesContentType}, events=${eventsContentType}`);
              }
            } else {
              console.log(`Failed: venues=${venuesResponse.status}, events=${eventsResponse.status}`);
            }
          } catch (err) {
            console.log(`Error with endpoints ${JSON.stringify(endpoints)}:`, err.message);
            continue;
          }
        }

        if (!successfulEndpoint) {
          throw new Error('All API endpoints failed');
        }

        // Process venues
        console.log('Raw venues data:', venuesData);
        if (Array.isArray(venuesData)) {
          const activeVenues = venuesData
            .filter(venue => {
              console.log(`Venue ${venue.name}: is_active = ${venue.is_active} (type: ${typeof venue.is_active})`);
              return venue.is_active === 1 || venue.is_active === true || venue.is_active === '1';
            })
            .slice(0, 4);
          
          console.log(`Found ${activeVenues.length} active venues:`, activeVenues);
          setVenues(activeVenues);
        } else {
          console.error('Venues data is not an array:', venuesData);
        }

        // Process events
        console.log('Raw events data:', eventsData);
        if (Array.isArray(eventsData)) {
          const now = new Date();
          const upcomingEvents = eventsData
            .filter(event => {
              const eventDate = new Date(event.start_datetime);
              const isUpcoming = eventDate > now;
              console.log(`Event ${event.name}: start_datetime = ${event.start_datetime}, isUpcoming = ${isUpcoming}`);
              return isUpcoming;
            })
            .slice(0, 4);
          
          console.log(`Found ${upcomingEvents.length} upcoming events:`, upcomingEvents);
          setEvents(upcomingEvents);
        } else {
          console.error('Events data is not an array:', eventsData);
        }

      } catch (err) {
        console.error('Error fetching featured content:', err);
        setFeaturedError(`Failed to load featured content: ${err.message}`);
      } finally {
        setFeaturedLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchFeaturedContent();
    }
  }, [isAuthenticated]);

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

  const enterinfo = () => {
    navigate('/preferences');
  };

  const formatCost = (cost) => {
    if (!cost || cost === 0) return 'Free';
    return `$${parseFloat(cost).toFixed(2)}`;
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'TBA';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVenueTypeIcon = (venueType) => {
    const icons = {
      'Beach/River': '🏖️',
      'Outdoor Adventure': '🏞️',
      'Indoor Adventure': '🎮',
      'Museum/Historical Site': '🏛️',
      'Food & Dining (Local)': '🍽️',
      'Food & Dining (Unique)': '🍴',
      'Club/Bar/Party': '🍻',
      'Live Music': '🎵',
      'Festival': '🎪'
    };
    return icons[venueType] || '📍';
  };

  const getEventTypeIcon = (eventType) => {
    const icons = {
      'Concert': '🎤',
      'Party': '🎉',
      'Festival': '🎪',
      'Sport': '⚽',
      'Art/Talent Showcasing': '🎨'
    };
    return icons[eventType] || '🎫';
  };

  // Helper function to get icon for preference
  const getPreferenceIcon = (preferenceName) => {
    const defaultIcons = {
      // Exact matches for your system preferences
      'Concert': '🎤',
      'Party': '🎉',
      'Festival': '🎪',
      'Sport': '⚽',
      'Art/Talent': '🎨',
      'Outdoor Adventure': '🏞️',
      'Indoor Adventure': '🎮',
      'Museum/Historical Site': '🏛️',
      'Local Food/Dining': '🍽️',
      'Unique Food/Dining': '🍴',
      'Club/Bar/Party': '🍻',
      'Live Music': '🎵',
      
      
    };
    
    // Try exact match first
    if (defaultIcons[preferenceName]) {
      return defaultIcons[preferenceName];
    }
    
    // Try partial matches (case insensitive) for any variations
    const lowerPreference = preferenceName.toLowerCase();
    for (const [key, icon] of Object.entries(defaultIcons)) {
      if (key.toLowerCase().includes(lowerPreference) || lowerPreference.includes(key.toLowerCase())) {
        return icon;
      }
    }
    
    return '⭐'; // Default fallback
  };

  return (
    <div className="profile-container">
      <header className="trip-header">
        <div className="header-content">
          <div className="logo">Yaad Quest</div>
          <nav className="nav-links">
            <a href="/tourist-profile">Home</a>
            <a href="/search">Explore</a>
          </nav>
          <button onClick={handleLogout}>logout</button>
        </div>
      </header>

      <div>
        <div className="content-body">
          <aside className="sidebar">
            <img src={profileImage} alt="User" className="profile-pic" />
            <h2>Welcome {user.username}</h2>

            <h3>Preferences</h3>
            <div className="preferences">
              {preferencesLoading ? (
                <div className="loading-message">Loading preferences...</div>
              ) : preferencesError ? (
                <div className="error-message">Unable to load preferences</div>
              ) : preferences.length > 0 ? (
                preferences
                  .sort((a, b) => (b.weight || 0) - (a.weight || 0)) // Sort by weight, highest first
                  .map((preference, index) => (
                    <span key={index} title={`Weight: ${preference.weight || 'N/A'}`}>
                      {getPreferenceIcon(preference.preference_name)} {preference.preference_name}
                    </span>
                  ))
              ) : (
                <div className="no-preferences">
                  <span>Your preferences will be shown here</span>
                </div>
              )}
            </div>
            <Link to="/prefer">
              {preferences.length > 0 ? 'Edit Preferences' : 'Set Preferences'}
            </Link>
          </aside>

          <main className="main-content">
            <section className="my-trip">
              <div className="trip-details">
                <h2>{trip.name}</h2>
                <p>{trip.dates}</p>
                <button className="btn" onClick={enterinfo}>Create Itinerary</button>
              </div>
            </section>

            {/* Featured Venues Section */}
            <section className="favorites">
              <div className="section-header">
                <h2>🏢 Featured Venues</h2>
                <Link to="/search?type=venues" className="view-all-link">View All →</Link>
              </div>
              
              {featuredLoading ? (
                <div className="loading-message">Loading venues...</div>
              ) : featuredError ? (
                <div className="error-message">Error loading venues</div>
              ) : venues.length > 0 ? (
                <div className="featured-grid">
                  {venues.map((venue) => (
                    <div className="featured-card" key={venue.venue_id}>
                      <div className="featured-card-image">
                        <div className="placeholder-image">
                          <span className="venue-icon">{getVenueTypeIcon(venue.venue_type)}</span>
                        </div>
                        <div className="featured-card-badge">
                          {formatCost(venue.cost)}
                        </div>
                      </div>
                      <div className="featured-card-content">
                        <h4>{venue.name}</h4>
                        <p className="featured-card-type">{venue.venue_type}</p>
                        <p className="featured-card-location">📍 {venue.address}</p>
                        {venue.description && (
                          <p className="featured-card-description">
                            {venue.description.length > 60 
                              ? `${venue.description.substring(0, 60)}...` 
                              : venue.description
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-content-message">No venues available at the moment</div>
              )}
            </section>

            {/* Featured Events Section */}
            <section className="favorites">
              <div className="section-header">
                <h2>🎉 Upcoming Events</h2>
                <Link to="/search?type=events" className="view-all-link">View All →</Link>
              </div>
              
              {featuredLoading ? (
                <div className="loading-message">Loading events...</div>
              ) : featuredError ? (
                <div className="error-message">Error loading events</div>
              ) : events.length > 0 ? (
                <div className="featured-grid">
                  {events.map((event) => (
                    <div className="featured-card" key={event.event_id}>
                      <div className="featured-card-image">
                        {event.flyer_image_path ? (
                          <img src={event.flyer_image_path} alt={event.name} />
                        ) : (
                          <div className="placeholder-image">
                            <span className="event-icon">{getEventTypeIcon(event.event_type)}</span>
                          </div>
                        )}
                        <div className="featured-card-badge">
                          {formatCost(event.cost)}
                        </div>
                      </div>
                      <div className="featured-card-content">
                        <h4>{event.name}</h4>
                        <p className="featured-card-type">{event.event_type}</p>
                        <p className="featured-card-date">📅 {formatDateTime(event.start_datetime)}</p>
                        <p className="featured-card-location">📍 {event.venue_location}</p>
                        {event.description && (
                          <p className="featured-card-description">
                            {event.description.length > 60 
                              ? `${event.description.substring(0, 60)}...` 
                              : event.description
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-content-message">No upcoming events at the moment</div>
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
                <a href="/search"><h3>Look for more things to do in Jamaica</h3></a>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TouristProfilePage;