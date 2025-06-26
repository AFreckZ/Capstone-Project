// //profile page for tourists
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import '../css/ProfilePage.css';
// import profileImage from '../images/sunset.jpg'; 
// import { Link } from 'react-router-dom';
// import { useNavigate } from "react-router-dom";

// const TouristProfilePage = () => {
//   const { user, userId, loading, isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();
  
//   // State for venues and events
//   const [venues, setVenues] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [featuredLoading, setFeaturedLoading] = useState(true);
//   const [featuredError, setFeaturedError] = useState(null);
  
//   // State for user preferences
//   const [preferences, setPreferences] = useState([]);
//   const [preferencesLoading, setPreferencesLoading] = useState(true);
//   const [preferencesError, setPreferencesError] = useState(null);
  
//   // NEW: State for saved itinerary
//   const [savedItinerary, setSavedItinerary] = useState(null);
//   const [hasItinerary, setHasItinerary] = useState(false);

//   // NEW: Check for saved itinerary on component mount
//   useEffect(() => {
//     const checkForSavedItinerary = () => {
//       try {
//         const touristId = 10; // Your hardcoded tourist ID
//         const saved = localStorage.getItem(`itinerary_${touristId}`);
        
//         if (saved) {
//           const itineraryData = JSON.parse(saved);
//           setSavedItinerary(itineraryData);
//           setHasItinerary(true);
//           console.log('Found saved itinerary:', itineraryData);
//         } else {
//           setHasItinerary(false);
//           console.log('No saved itinerary found');
//         }
//       } catch (error) {
//         console.error('Error checking for saved itinerary:', error);
//         setHasItinerary(false);
//       }
//     };

//     if (isAuthenticated) {
//       checkForSavedItinerary();
//     }
//   }, [isAuthenticated]);

//   // NEW: Handle view itinerary button click
//   const handleViewItinerary = () => {
//     if (hasItinerary) {
//       // Navigate to itinerary page - it will load the saved data automatically
//       navigate('/generate');
//     } else {
//       // No saved itinerary, redirect to create one
//       navigate('/preferences');
//     }
//   };

//   // NEW: Format date for display
//   const formatItineraryDate = (timestamp) => {
//     if (!timestamp) return '';
//     const date = new Date(timestamp);
//     return date.toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // NEW: Get itinerary summary for display
//   const getItinerarySummary = () => {
//     if (!savedItinerary) return null;
    
//     const activityCount = savedItinerary.optimalActivities?.length || 0;
//     const totalCost = savedItinerary.totalCost || 0;
    
//     // Calculate day count from optimalActivities since adjustedActivitiesByDay might not be saved
//     let dayCount = 0;
//     if (savedItinerary.optimalActivities && savedItinerary.optimalActivities.length > 0) {
//       const uniqueDates = new Set(savedItinerary.optimalActivities.map(activity => activity.date));
//       dayCount = uniqueDates.size;
//     }
    
//     return {
//       activityCount,
//       totalCost,
//       dayCount,
//       lastSaved: formatItineraryDate(savedItinerary.timestamp)
//     };
//   };

//   // Your existing useEffect for preferences (keeping exactly the same)
//   useEffect(() => {
//     const fetchUserPreferences = async () => {
//       try {
//         setPreferencesLoading(true);
//         setPreferencesError(null);

//         console.log('Fetching user preferences for user:', userId);

//         const token = localStorage.getItem('token') || localStorage.getItem('authToken');
//         console.log('Auth token available:', !!token);

//         const authHeaders = {
//           'Content-Type': 'application/json',
//         };

//         if (token) {
//           authHeaders['Authorization'] = `Bearer ${token}`;
//         }

//         const touristId = 10;
//         console.log('Using known tourist_id:', touristId);

//         const preferencesEndpointsToTry = [
//           `http://localhost:5001/api/preferences/tourists/${touristId}`,
//           `http://localhost:5001/api/preferences/${touristId}`,
//           `/api/preferences/tourists/${touristId}`,
//           `/api/preferences/${touristId}`,
//         ];

//         let preferencesData = null;
//         let successfulEndpoint = null;

//         for (const endpoint of preferencesEndpointsToTry) {
//           try {
//             console.log(`\n=== Trying preferences endpoint: ${endpoint} ===`);
            
//             const response = await fetch(endpoint, {
//               method: 'GET',
//               headers: authHeaders,
//             });

//             console.log(`Response status: ${response.status}`);
//             console.log(`Response headers:`, [...response.headers.entries()]);

//             if (response.ok) {
//               const contentType = response.headers.get('content-type');
//               console.log(`Content-Type: ${contentType}`);
              
//               if (contentType?.includes('application/json')) {
//                 preferencesData = await response.json();
//                 successfulEndpoint = endpoint;
//                 console.log(` SUCCESS with endpoint: ${endpoint}`);
//                 console.log(`Raw response data:`, JSON.stringify(preferencesData, null, 2));
//                 break;
//               } else {
//                 console.log(`Wrong content type: ${contentType}`);
//                 const responseText = await response.text();
//                 console.log(`Response text:`, responseText);
//               }
//             } else {
//               console.log(` Failed with status: ${response.status}`);
//               const responseText = await response.text();
//               console.log(`Error response text:`, responseText);
              
//               if (response.status === 404 && endpoint.includes('/tourists/')) {
//                 console.log('404 from tourists endpoint - this tourist may not have preferences set');
//               }
//             }
//           } catch (err) {
//             console.log(` Network error with endpoint ${endpoint}:`, err.message);
//             continue;
//           }
//         }

//         if (!successfulEndpoint) {
//           console.log('\n=== Trying fallback: Get all tourist preferences ===');
          
//           const fallbackEndpoints = [
//             'http://localhost:5001/api/prefer/tourists',
//             '/api/preferences/tourists'
//           ];

//           for (const endpoint of fallbackEndpoints) {
//             try {
//               console.log(`Trying fallback endpoint: ${endpoint}`);
              
//               const response = await fetch(endpoint, {
//                 method: 'GET',
//                 headers: authHeaders,
//               });
              
//               console.log(`Fallback response status: ${response.status}`);
              
//               if (response.ok) {
//                 const allTouristPrefs = await response.json();
//                 console.log('All tourist preferences count:', allTouristPrefs.length);
//                 console.log('All tourist preferences:', allTouristPrefs);
                
//                 const userPrefs = allTouristPrefs.filter(pref => {
//                   console.log(`Checking pref: tourist_id=${pref.tourist_id} (type: ${typeof pref.tourist_id}) vs ${touristId} (type: ${typeof touristId})`);
//                   return pref.tourist_id === parseInt(touristId) || pref.tourist_id === touristId;
//                 });
                
//                 console.log(`Found ${userPrefs.length} matching preferences for tourist_id ${touristId}`);
//                 console.log('Matching preferences:', userPrefs);
                
//                 if (userPrefs.length > 0) {
//                   preferencesData = userPrefs;
//                   successfulEndpoint = 'fallback-all-tourists';
//                   break;
//                 }
//               }
//             } catch (fallbackErr) {
//               console.log('Fallback method error:', fallbackErr);
//             }
//           }
//         }

//         if (!successfulEndpoint) {
//           console.log(' All methods failed - no preferences could be loaded');
//           setPreferences([]);
//           return;
//         }

//         console.log('\n=== Processing preferences data ===');
//         console.log('Raw preferences data:', JSON.stringify(preferencesData, null, 2));
//         let processedPreferences = [];

//         if (preferencesData && preferencesData !== null) {
//           if (Array.isArray(preferencesData)) {
//             if (preferencesData.length === 0) {
//               console.log('Empty preferences array');
//             } else {
//               const preferenceRecord = preferencesData[0];
//               console.log('First preference record:', JSON.stringify(preferenceRecord, null, 2));
              
//               if (preferenceRecord && preferenceRecord.preferences) {
//                 console.log('Raw preferences field:', preferenceRecord.preferences);
//                 console.log('Preferences field type:', typeof preferenceRecord.preferences);
                
//                 try {
//                   const parsedPrefs = typeof preferenceRecord.preferences === 'string' 
//                     ? JSON.parse(preferenceRecord.preferences)
//                     : preferenceRecord.preferences;
                  
//                   console.log('Parsed preferences:', parsedPrefs);
//                   console.log('Parsed preferences type:', typeof parsedPrefs);
//                   console.log('Is array?', Array.isArray(parsedPrefs));
                  
//                   if (Array.isArray(parsedPrefs)) {
//                     processedPreferences = parsedPrefs.map(pref => {
//                       console.log('Processing pref:', pref);
//                       return {
//                         preference_name: pref.tag,
//                         weight: pref.weight
//                       };
//                     });
//                   } else {
//                     console.log('Parsed preferences is not an array:', parsedPrefs);
//                   }
//                 } catch (parseError) {
//                   console.error(' Error parsing preferences JSON:', parseError);
//                   console.log('Raw preferences value that failed to parse:', preferenceRecord.preferences);
//                 }
//               } else {
//                 console.log('No preferences field in record:', Object.keys(preferenceRecord));
//               }
//             }
//           } else if (preferencesData.preferences) {
//             console.log('Single object response with preferences field');
//             try {
//               const parsedPrefs = typeof preferencesData.preferences === 'string'
//                 ? JSON.parse(preferencesData.preferences)
//                 : preferencesData.preferences;
              
//               if (Array.isArray(parsedPrefs)) {
//                 processedPreferences = parsedPrefs.map(pref => ({
//                   preference_name: pref.tag,
//                   weight: pref.weight
//                 }));
//               }
//             } catch (parseError) {
//               console.error('Error parsing single object preferences:', parseError);
//             }
//           } else {
//             console.log('Unexpected data structure:', preferencesData);
//           }
//         }

//         console.log('Final processed preferences:', processedPreferences);
//         setPreferences(processedPreferences);

//       } catch (err) {
//         console.error('Error fetching user preferences:', err);
//         setPreferencesError(`Failed to load preferences: ${err.message}`);
//         setPreferences([]);
//       } finally {
//         setPreferencesLoading(false);
//       }
//     };

//     if (isAuthenticated && userId) {
//       fetchUserPreferences();
//     }
//   }, [isAuthenticated, userId]);

//   // Your existing useEffect for featured content (keeping exactly the same)
//   useEffect(() => {
//     const fetchFeaturedContent = async () => {
//       try {
//         setFeaturedLoading(true);
//         setFeaturedError(null);

//         console.log('Fetching featured content...');

//         const endpointsToTry = [
//           { venues: '/api/venues/', events: '/api/events/' },
//           { venues: '/api/venues', events: '/api/events' },
//           { venues: 'http://localhost:5001/api/venues/', events: 'http://localhost:5001/api/events/' },
//           { venues: 'http://localhost:5001/api/venues', events: 'http://localhost:5001/api/events' },
//           { venues: '/api/venue/', events: '/api/event/' },
//           { venues: 'http://localhost:5001/api/venue/', events: 'http://localhost:5001/api/event/' }
//         ];

//         let venuesData = [];
//         let eventsData = [];
//         let successfulEndpoint = null;

//         for (const endpoints of endpointsToTry) {
//           try {
//             console.log(`Trying endpoints: venues=${endpoints.venues}, events=${endpoints.events}`);
            
//             const [venuesResponse, eventsResponse] = await Promise.all([
//               fetch(endpoints.venues),
//               fetch(endpoints.events)
//             ]);

//             console.log(`Venues response status: ${venuesResponse.status}`);
//             console.log(`Events response status: ${eventsResponse.status}`);

//             if (venuesResponse.ok && eventsResponse.ok) {
//               const venuesContentType = venuesResponse.headers.get('content-type');
//               const eventsContentType = eventsResponse.headers.get('content-type');
              
//               if (venuesContentType?.includes('application/json') && eventsContentType?.includes('application/json')) {
//                 venuesData = await venuesResponse.json();
//                 eventsData = await eventsResponse.json();
//                 successfulEndpoint = endpoints;
//                 console.log(`Success with endpoints: ${JSON.stringify(endpoints)}`);
//                 console.log(`Found ${venuesData.length} venues and ${eventsData.length} events`);
//                 break;
//               } else {
//                 console.log(`Wrong content type: venues=${venuesContentType}, events=${eventsContentType}`);
//               }
//             } else {
//               console.log(`Failed: venues=${venuesResponse.status}, events=${eventsResponse.status}`);
//             }
//           } catch (err) {
//             console.log(`Error with endpoints ${JSON.stringify(endpoints)}:`, err.message);
//             continue;
//           }
//         }

//         if (!successfulEndpoint) {
//           throw new Error('All API endpoints failed');
//         }

//         console.log('Raw venues data:', venuesData);
//         if (Array.isArray(venuesData)) {
//           const activeVenues = venuesData
//             .filter(venue => {
//               console.log(`Venue ${venue.name}: is_active = ${venue.is_active} (type: ${typeof venue.is_active})`);
//               return venue.is_active === 1 || venue.is_active === true || venue.is_active === '1';
//             })
//             .slice(0, 4);
          
//           console.log(`Found ${activeVenues.length} active venues:`, activeVenues);
//           setVenues(activeVenues);
//         } else {
//           console.error('Venues data is not an array:', venuesData);
//         }

//         console.log('Raw events data:', eventsData);
//         if (Array.isArray(eventsData)) {
//           const now = new Date();
//           const upcomingEvents = eventsData
//             .filter(event => {
//               const eventDate = new Date(event.start_datetime);
//               const isUpcoming = eventDate > now;
//               console.log(`Event ${event.name}: start_datetime = ${event.start_datetime}, isUpcoming = ${isUpcoming}`);
//               return isUpcoming;
//             })
//             .slice(0, 4);
          
//           console.log(`Found ${upcomingEvents.length} upcoming events:`, upcomingEvents);
//           setEvents(upcomingEvents);
//         } else {
//           console.error('Events data is not an array:', eventsData);
//         }

//       } catch (err) {
//         console.error('Error fetching featured content:', err);
//         setFeaturedError(`Failed to load featured content: ${err.message}`);
//       } finally {
//         setFeaturedLoading(false);
//       }
//     };

//     if (isAuthenticated) {
//       fetchFeaturedContent();
//     }
//   }, [isAuthenticated]);

//   // All your existing functions (keeping exactly the same)
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return <div>Please log in to view your profile.</div>;
//   }

//   if (!user) {
//     return <div>User data not available. Please try logging in again.</div>;
//   }

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const enterinfo = () => {
//     navigate('/preferences');
//   };

//   const formatCost = (cost) => {
//     if (!cost || cost === 0) return 'Free';
//     return `$${parseFloat(cost).toFixed(2)}`;
//   };

//   const formatDateTime = (dateTimeString) => {
//     if (!dateTimeString) return 'TBA';
//     const date = new Date(dateTimeString);
//     return date.toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getVenueTypeIcon = (venueType) => {
//     const icons = {
//       'Beach/River': '🏖️',
//       'Outdoor Adventure': '🏞️',
//       'Indoor Adventure': '🎮',
//       'Museum/Historical Site': '🏛️',
//       'Food & Dining (Local)': '🍽️',
//       'Food & Dining (Unique)': '🍴',
//       'Club/Bar/Party': '🍻',
//       'Live Music': '🎵',
//       'Festival': '🎪'
//     };
//     return icons[venueType] || '📍';
//   };

//   const getEventTypeIcon = (eventType) => {
//     const icons = {
//       'Concert': '🎤',
//       'Party': '🎉',
//       'Festival': '🎪',
//       'Sport': '⚽',
//       'Art/Talent Showcasing': '🎨'
//     };
//     return icons[eventType] || '🎫';
//   };

//   const getPreferenceIcon = (preferenceName) => {
//     const defaultIcons = {
//       'Concert': '🎤',
//       'Party': '🎉',
//       'Festival': '🎪',
//       'Sport': '⚽',
//       'Art/Talent': '🎨',
//       'Outdoor Adventure': '🏞️',
//       'Indoor Adventure': '🎮',
//       'Museum/Historical Site': '🏛️',
//       'Local Food/Dining': '🍽️',
//       'Unique Food/Dining': '🍴',
//       'Club/Bar/Party': '🍻',
//       'Live Music': '🎵',
//     };
    
//     if (defaultIcons[preferenceName]) {
//       return defaultIcons[preferenceName];
//     }
    
//     const lowerPreference = preferenceName.toLowerCase();
//     for (const [key, icon] of Object.entries(defaultIcons)) {
//       if (key.toLowerCase().includes(lowerPreference) || lowerPreference.includes(key.toLowerCase())) {
//         return icon;
//       }
//     }
    
//     return '⭐';
//   };

//   // NEW: Get itinerary summary for display
//   const itinerarySummary = getItinerarySummary();

//   return (
//     <div className="profile-container">
//       <header className="trip-header">
//         <div className="header-content">
//           <div className="logo">Yaad Quest</div>
//           <nav className="nav-links">
//             <a href="/tourist-profile">Home</a>
//             <a href="/search">Explore</a>
//           </nav>
//           <button onClick={handleLogout}>logout</button>
//         </div>
//       </header>

//       <div>
//         <div className="content-body">
//           <aside className="sidebar">
//             <img src={profileImage} alt="User" className="profile-pic" />
//             <h2>Welcome {user.username}</h2>

//             <h3>Preferences</h3>
//             <div className="preferences">
//               {preferencesLoading ? (
//                 <div className="loading-message">Loading preferences...</div>
//               ) : preferencesError ? (
//                 <div className="error-message">Unable to load preferences</div>
//               ) : preferences.length > 0 ? (
//                 preferences
//                   .sort((a, b) => (b.weight || 0) - (a.weight || 0))
//                   .map((preference, index) => (
//                     <span key={index} title={`Weight: ${preference.weight || 'N/A'}`}>
//                       {getPreferenceIcon(preference.preference_name)} {preference.preference_name}
//                     </span>
//                   ))
//               ) : (
//                 <div className="no-preferences">
//                   <span>Your preferences will be shown here</span>
//                 </div>
//               )}
//             </div>
//             <Link to="/prefer">
//               {preferences.length > 0 ? 'Edit Preferences' : 'Set Preferences'}
//             </Link>
//           </aside>

//           <main className="main-content">
//             <section className="my-trip">
//               <div className="trip-details">
//                 <h1>Create your dream vacation by entering your preferences and trip information </h1>
//                  <button className="btn" onClick={enterinfo}>Enter information</button>
//               </div>
//             </section>

//             {/* MODIFIED: Enhanced Itinerary Section */}
//             <section className="my-trip">
//               <div className="trip-details">
//                 {hasItinerary ? (
//                   <>
//                     <h1>Your Saved Itinerary</h1>
//                     {itinerarySummary && (
//                       <div style={{
//                         backgroundColor: '#e8f5e8',
//                         border: '1px solid #4caf50',
//                         borderRadius: '8px',
//                         padding: '16px',
//                         margin: '16px 0',
//                         color: '#2e7d32'
//                       }}>
//                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
//                           <span><strong>📅 {itinerarySummary.dayCount}</strong> days planned</span>
//                           <span><strong>🎯 {itinerarySummary.activityCount}</strong> activities</span>
//                           <span><strong>💰 ${itinerarySummary.totalCost.toFixed(2)}</strong> total cost</span>
//                         </div>
//                         <div style={{ fontSize: '14px', opacity: 0.8 }}>
//                           Last saved: {itinerarySummary.lastSaved}
//                         </div>
//                       </div>
//                     )}
//                     <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
//                       <button 
//                         className="btn" 
//                         onClick={handleViewItinerary}
//                         style={{ backgroundColor: '#4caf50' }}
//                       >
//                         📋 View My Itinerary
//                       </button>
//                       <button 
//                         className="btn" 
//                         onClick={() => navigate('/generate')}
//                         style={{ backgroundColor: '#ff9800' }}
//                       >
//                         🔄 Create New Itinerary
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <h1>Generate your Itinerary here</h1>
//                     <div style={{
//                       backgroundColor: '#fff3cd',
//                       border: '1px solid #ffeaa7',
//                       borderRadius: '8px',
//                       padding: '16px',
//                       margin: '16px 0',
//                       color: '#856404'
//                     }}>
//                       <p style={{ margin: 0 }}>
//                         💡 No saved itinerary found. Create your first personalized itinerary!
//                       </p>
//                     </div>
//                     <a href="/generate"><button className="btn">Create Itinerary</button></a>
//                   </>
//                 )}
//               </div>
//             </section>

//             {/* Keep all your existing sections exactly the same */}
//             <section className="favorites">
//               <div className="section-header">
//                 <h2>Featured Venues</h2>
//                 <Link to="/search?type=venues" className="view-all-link">View All →</Link>
//               </div>
              
//               {featuredLoading ? (
//                 <div className="loading-message">Loading venues...</div>
//               ) : featuredError ? (
//                 <div className="error-message">Error loading venues</div>
//               ) : venues.length > 0 ? (
//                 <div className="featured-grid">
//                   {venues.map((venue) => (
//                     <div className="featured-card" key={venue.venue_id}>
//                       <div className="featured-card-image">
//                         <div className="placeholder-image">
//                           <span className="venue-icon">{getVenueTypeIcon(venue.venue_type)}</span>
//                         </div>
//                         <div className="featured-card-badge">
//                           {formatCost(venue.cost)}
//                         </div>
//                       </div>
//                       <div className="featured-card-content">
//                         <h4>{venue.name}</h4>
//                         <p className="featured-card-type">{venue.venue_type}</p>
//                         <p className="featured-card-location">📍 {venue.address}</p>
//                         {venue.description && (
//                           <p className="featured-card-description">
//                             {venue.description.length > 60 
//                               ? `${venue.description.substring(0, 60)}...` 
//                               : venue.description
//                             }
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="no-content-message">No venues available at the moment</div>
//               )}
//             </section>

//             <section className="favorites">
//               <div className="section-header">
//                 <h2>🎉 Upcoming Events</h2>
//                <Link to="/search?type=events" className="view-all-link"><button> View All →</button></Link>
//               </div>
              
//               {featuredLoading ? (
//                 <div className="loading-message">Loading events...</div>
//               ) : featuredError ? (
//                 <div className="error-message">Error loading events</div>
//               ) : events.length > 0 ? (
//                 <div className="featured-grid">
//                   {events.map((event) => (
//                     <div className="featured-card" key={event.event_id}>
//                       <div className="featured-card-image">
//                         {event.flyer_image_path ? (
//                           <img src={event.flyer_image_path} alt={event.name} />
//                         ) : (
//                           <div className="placeholder-image">
//                             <span className="event-icon">{getEventTypeIcon(event.event_type)}</span>
//                           </div>
//                         )}
//                         <div className="featured-card-badge">
//                           {formatCost(event.cost)}
//                         </div>
//                       </div>
//                       <div className="featured-card-content">
//                         <h4>{event.name}</h4>
//                         <p className="featured-card-type">{event.event_type}</p>
//                         <p className="featured-card-date">📅 {formatDateTime(event.start_datetime)}</p>
//                         <p className="featured-card-location">📍 {event.venue_location}</p>
//                         {event.description && (
//                           <p className="featured-card-description">
//                             {event.description.length > 60 
//                               ? `${event.description.substring(0, 60)}...` 
//                               : event.description
//                             }
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="no-content-message">No upcoming events at the moment</div>
//               )}
//             </section>

//             <footer className="footer">
//               <div>
//                 <h3>Company</h3>
//                 <p>About Us</p>
//               </div>
//               <div>
//                 <h3>Contact</h3>
//                 <p>yaadquest@gmail.com</p>
//               </div>
//               <div>
//                 <a href="/search"><h3>Explore</h3></a>
//               </div>
//             </footer>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TouristProfilePage;
//profile page for tourists
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../css/ProfilePage.css';
import profileImage from '../images/sunset.jpg'; 
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const TouristProfilePage = () => {
  const { user, userId, loading: authLoading, isAuthenticated, logout, token } = useAuth();
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
  
  // State for saved itinerary
  const [savedItinerary, setSavedItinerary] = useState(null);
  const [hasItinerary, setHasItinerary] = useState(false);

  // Add authentication check and redirect logic
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Check for saved itinerary on component mount - using dynamic userId
  useEffect(() => {
    const checkForSavedItinerary = () => {
      if (!userId) return; // Don't run if userId is not available yet

      try {
        console.log('Checking for saved itinerary for user:', userId);
        const saved = localStorage.getItem(`itinerary_${userId}`);
        
        if (saved) {
          const itineraryData = JSON.parse(saved);
          setSavedItinerary(itineraryData);
          setHasItinerary(true);
          console.log('✅ Found saved itinerary for user', userId, ':', itineraryData);
        } else {
          setHasItinerary(false);
          console.log('❌ No saved itinerary found for user', userId);
        }
      } catch (error) {
        console.error('Error checking for saved itinerary:', error);
        setHasItinerary(false);
      }
    };

    if (isAuthenticated && userId) {
      checkForSavedItinerary();
    }
  }, [isAuthenticated, userId]);

  // Handle view itinerary button click
  const handleViewItinerary = () => {
    if (hasItinerary) {
      // Navigate to itinerary page - it will load the saved data automatically
      navigate('/generate');
    } else {
      // No saved itinerary, redirect to create one
      navigate('/preferences');
    }
  };

  // Format date for display
  const formatItineraryDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get itinerary summary for display
  const getItinerarySummary = () => {
    if (!savedItinerary) return null;
    
    const activityCount = savedItinerary.optimalActivities?.length || 0;
    const totalCost = savedItinerary.totalCost || 0;
    
    // Calculate day count from optimalActivities since adjustedActivitiesByDay might not be saved
    let dayCount = 0;
    if (savedItinerary.optimalActivities && savedItinerary.optimalActivities.length > 0) {
      const uniqueDates = new Set(savedItinerary.optimalActivities.map(activity => activity.date));
      dayCount = uniqueDates.size;
    }
    
    return {
      activityCount,
      totalCost,
      dayCount,
      lastSaved: formatItineraryDate(savedItinerary.timestamp)
    };
  };

  // Updated preferences fetching with dynamic userId and authentication
  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!userId || !token) return; // Don't run if userId or token is not available yet

      try {
        setPreferencesLoading(true);
        setPreferencesError(null);

        console.log('🔍 Fetching user preferences for user:', userId);

        // Use the new authenticated route similar to itinerary planner
        const response = await axios.get(`http://localhost:5001/api/prefer/tourists/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ Successfully fetched tourist preferences:', response.data);

        const currentTourist = response.data[0]; // Get first item from array
        
        if (!currentTourist || !currentTourist.tourist_id) {
          console.log('❌ No tourist profile found for user', userId);
          setPreferences([]);
          return;
        }

        // Process preferences - they're already parsed in the backend
        const processedPrefs = currentTourist.preferences?.length > 0
          ? currentTourist.preferences.map(pref => ({
              preference_name: pref.category || pref.tag,
              weight: pref.weight
            }))
          : [];

        console.log('📋 Processed preferences:', processedPrefs);
        setPreferences(processedPrefs);

      } catch (err) {
        console.error('❌ Error fetching user preferences:', err);
        setPreferencesError(`Failed to load preferences: ${err.message}`);
        setPreferences([]);
      } finally {
        setPreferencesLoading(false);
      }
    };

    if (isAuthenticated && userId && token) {
      fetchUserPreferences();
    }
  }, [isAuthenticated, userId, token]);

  // Updated featured content fetching with authentication
  useEffect(() => {
    const fetchFeaturedContent = async () => {
      if (!token) return; // Don't run if token is not available yet

      try {
        setFeaturedLoading(true);
        setFeaturedError(null);

        console.log('🔍 Fetching featured content...');

        // Use authenticated API calls similar to itinerary planner
        const [venuesResponse, eventsResponse] = await Promise.all([
          axios.get('http://localhost:5001/api/venues/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          axios.get('http://localhost:5001/api/events', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);

        console.log(`✅ Found ${venuesResponse.data.length} venues and ${eventsResponse.data.length} events`);

        // Process venues
        const activeVenues = venuesResponse.data
          .filter(venue => {
            console.log(`Venue ${venue.name}: is_active = ${venue.is_active}`);
            return venue.is_active === 1 || venue.is_active === true || venue.is_active === '1';
          })
          .slice(0, 4);
        
        console.log(`📍 Found ${activeVenues.length} active venues`);
        setVenues(activeVenues);

        // Process events
        const now = new Date();
        const upcomingEvents = eventsResponse.data
          .filter(event => {
            const eventDate = new Date(event.start_datetime);
            const isUpcoming = eventDate > now;
            console.log(`Event ${event.name}: start_datetime = ${event.start_datetime}, isUpcoming = ${isUpcoming}`);
            return isUpcoming;
          })
          .slice(0, 4);
        
        console.log(`🎉 Found ${upcomingEvents.length} upcoming events`);
        setEvents(upcomingEvents);

      } catch (err) {
        console.error('❌ Error fetching featured content:', err);
        setFeaturedError(`Failed to load featured content: ${err.message}`);
      } finally {
        setFeaturedLoading(false);
      }
    };

    if (isAuthenticated && token) {
      fetchFeaturedContent();
    }
  }, [isAuthenticated, token]);

  // Early return if not authenticated - AFTER all hooks
  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  if (!user || !userId) {
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

  const getPreferenceIcon = (preferenceName) => {
    const defaultIcons = {
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
    
    if (defaultIcons[preferenceName]) {
      return defaultIcons[preferenceName];
    }
    
    const lowerPreference = preferenceName.toLowerCase();
    for (const [key, icon] of Object.entries(defaultIcons)) {
      if (key.toLowerCase().includes(lowerPreference) || lowerPreference.includes(key.toLowerCase())) {
        return icon;
      }
    }
    
    return '⭐';
  };

  // Get itinerary summary for display
  const itinerarySummary = getItinerarySummary();

  return (
    <div className="profile-container">
      <header className="trip-header">
        <div className="header-content">
          <div className="logo">Yaad Quest</div>
          <nav className="nav-links">
            <a href="/tourist-profile">Home</a>
            <a href="/search">Explore</a>
            <a href = "/about">About</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user && (
              <span style={{ fontSize: '14px', color: '#666' }}>
                Welcome, {user.username}
              </span>
            )}
            <button onClick={handleLogout}>logout</button>
          </div>
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
                  .sort((a, b) => (b.weight || 0) - (a.weight || 0))
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
                <h1>Create your dream vacation by entering your preferences and trip information </h1>
                 <button className="btn" onClick={enterinfo}>Enter information</button>
              </div>
            </section>

            {/* Enhanced Itinerary Section */}
            <section className="my-trip">
              <div className="trip-details">
                {hasItinerary ? (
                  <>
                    <h1>Your Saved Itinerary</h1>
                    {itinerarySummary && (
                      <div style={{
                        backgroundColor: '#e8f5e8',
                        border: '1px solid #4caf50',
                        borderRadius: '8px',
                        padding: '16px',
                        margin: '16px 0',
                        color: '#2e7d32'
                      }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
                          <span><strong>📅 {itinerarySummary.dayCount}</strong> days planned</span>
                          <span><strong>🎯 {itinerarySummary.activityCount}</strong> activities</span>
                          <span><strong>💰 ${itinerarySummary.totalCost.toFixed(2)}</strong> total cost</span>
                        </div>
                        <div style={{ fontSize: '14px', opacity: 0.8 }}>
                          Last saved: {itinerarySummary.lastSaved}
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button 
                        className="btn" 
                        onClick={handleViewItinerary}
                        style={{ backgroundColor: '#4caf50' }}
                      >
                        📋 View My Itinerary
                      </button>
                      <button 
                        className="btn" 
                        onClick={() => navigate('/generate')}
                        style={{ backgroundColor: '#ff9800' }}
                      >
                        🔄 Create New Itinerary
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h1>Generate your Itinerary here</h1>
                    <div style={{
                      backgroundColor: '#fff3cd',
                      border: '1px solid #ffeaa7',
                      borderRadius: '8px',
                      padding: '16px',
                      margin: '16px 0',
                      color: '#856404'
                    }}>
                      <p style={{ margin: 0 }}>
                        💡 No saved itinerary found. Create your first personalized itinerary!
                      </p>
                      <br />
                      <small>If your are returning kindly select the button to regenerate your itinerary.</small>
                    </div>
                    <a href="/generate"><button className="btn">Create Itinerary</button></a>
                  </>
                )}
              </div>
            </section>

            {/* Rest of your existing sections remain the same */}
            <section className="favorites">
              <div className="section-header">
                <h2>Featured Venues</h2>
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

            <section className="favorites">
              <div className="section-header">
                <h2>🎉 Upcoming Events</h2>
               <Link to="/search?type=events" className="view-all-link"><button> View All →</button></Link>
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
                <a href="/search"><h3>Explore</h3></a>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TouristProfilePage;