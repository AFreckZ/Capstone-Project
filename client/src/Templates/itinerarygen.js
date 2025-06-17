// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import MapWithRouting from './MapWithRouting';
// import "../css/itinerary.css";

// const ItineraryPlanner = () => {
//   const [activities, setActivities] = useState([]);
//   const [preferences, setPreferences] = useState([]);
//   const [touristInfo, setTouristInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [touristId, setTouristId] = useState(10);
//   const [optimalActivities, setOptimalActivities] = useState([]);
//   const [selectedActivity, setSelectedActivity] = useState(null);
//   const [showMap, setShowMap] = useState(false);
//   const [routeData, setRouteData] = useState([]);
//   const [travelTimes, setTravelTimes] = useState(new Map());

//   // FREE geocoding using Nominatim (no API key required!)
//   const geocodeAddress = async (address) => {
//     if (!address) return null;
    
//     try {
//       // Add delay to respect Nominatim usage policy (max 1 request per second)
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}, Jamaica&limit=1`,
//         {
//           headers: {
//             'User-Agent': 'Jamaica Tourism Itinerary Planner' // Required by Nominatim
//           }
//         }
//       );
//       const data = await response.json();
      
//       if (data && data.length > 0) {
//         return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
//       }
//     } catch (error) {
//       console.error('Geocoding error:', error);
//     }
    
//     return null;
//   };

//   // Helper functions
//   const timeToMinutes = (timeStr) => {
//     const [h, m] = timeStr.split(':').map(Number);
//     return h * 60 + m;
//   };

//   const minutesToTime = (minutes) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
//   };

//   // Helper function to calculate end time
//   const calculateEndTime = (startTime, duration) => {
//     const [h, m] = startTime.split(':').map(Number);
//     const startMinutes = h * 60 + m;
//     const endMinutes = startMinutes + duration;
//     const hours = Math.floor(endMinutes / 60);
//     const minutes = endMinutes % 60;
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
//   };

//   // Calculate travel time between two activities
//   const getTravelTime = (fromActivityId, toActivityId) => {
//     const key = `${fromActivityId}-${toActivityId}`;
//     return travelTimes.get(key) || 0; // Return in minutes
//   };

//   // Check for time conflicts including travel time
//   const hasTimeConflictWithTravel = (act1, act2) => {
//     if (act1.date !== act2.date) return false;
    
//     const s1 = timeToMinutes(act1.start_time);
//     const e1 = s1 + act1.duration;
//     const s2 = timeToMinutes(act2.start_time);
//     const e2 = s2 + act2.duration;
    
//     // Add travel time buffer
//     const travelTime = getTravelTime(act1.id, act2.id);
//     const bufferTime = Math.max(travelTime, 15); // Minimum 15 minutes buffer
    
//     // Check if there's enough time between activities
//     if (e1 <= s2) {
//       return (s2 - e1) < bufferTime; // Not enough time for travel
//     }
//     if (e2 <= s1) {
//       return (s1 - e2) < bufferTime; // Not enough time for travel
//     }
    
//     return true; // Activities overlap
//   };

//   // Ensures the activities don't clash
//   const hasTimeConflict = (act1, act2) => {
//     if (act1.date !== act2.date) return false;
//     const s1 = timeToMinutes(act1.start_time);
//     const e1 = s1 + act1.duration;
//     const s2 = timeToMinutes(act2.start_time);
//     const e2 = s2 + act2.duration;
//     return !(e1 <= s2 || e2 <= s1);
//   };

//   // Ensuring the activities are within a certain time frame
//   const fitsPreferredSlot = (activity) => {
//     if (!touristInfo) return false;
//     const actStart = timeToMinutes(activity.start_time);
//     const actEnd = actStart + activity.duration;
//     const prefStart = timeToMinutes(touristInfo.preferred_start?.substring(0, 5)) || timeToMinutes('09:00');
//     const prefEnd = timeToMinutes(touristInfo.preferred_end?.substring(0, 5)) || timeToMinutes('18:00');
//     const overlaps = (actStart <= prefEnd) && (actEnd >= prefStart);
    
//     return overlaps;
//   };

//   const fitsPreferredDate = (activity) => {
//     if (!touristInfo || !touristInfo.preferred_dates) return true;

//     // Get valid preferred dates within trip period
//     const tripStart = new Date(touristInfo.trip_start);
//     const tripEnd = new Date(touristInfo.trip_end);
//     const validPreferredDates = touristInfo.preferred_dates.filter(dateStr => {
//       const date = new Date(dateStr);
//       return date >= tripStart && date <= tripEnd;
//     });

//     // STRICT CHECK: Activity must be on a valid preferred date
//     let activityDateStr;
//     if (activity.date instanceof Date) {
//       activityDateStr = activity.date.toISOString().split('T')[0];
//     } else if (typeof activity.date === 'string') {
//       activityDateStr = activity.date.split('T')[0];
//     } else {
//       console.log(`${activity.name}: No valid date found`);
//       return false;
//     }

//     const isOnValidPreferredDate = validPreferredDates.includes(activityDateStr);
//     console.log(`${activity.name} on ${activityDateStr}: Valid preferred date = ${isOnValidPreferredDate}`);
//     console.log(`Valid preferred dates: [${validPreferredDates.join(', ')}]`);
    
//     return isOnValidPreferredDate;
//   };

//   // Ensures the venues are open on certain days
//   const isVenueOpenOnActivityDate = (activity) => {
//     if (activity.type === 'event') return true;

//     if (activity.type === 'venue') {
//       const activityDate = new Date(activity.date);
//       const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//       const dayName = dayNames[activityDate.getDay()];

//       // days_open is already an object, no need to parse:
//       const daysOpen = activity.days_open;

//       return daysOpen[dayName] === true;
//     }

//     return false;
//   };

//   const normalizeTag = (text) => {
//     let normalized = text.toLowerCase().trim();
//     normalized = normalized.replace(/[()&\-/]/g, ' ');
//     normalized = normalized.replace(/\s+/g, ' ');
//     normalized = normalized.replace(/s\b/g, '');
//     return normalized.trim();
//   };

//   const calculatePreferenceScore = (activity) => {
//     let score = 0;
//     const normTags = activity.tags.map(normalizeTag);
    
//     for (const pref of preferences) {
//       const prefNorm = normalizeTag(pref.category);
//       for (const tag of normTags) {
//         if (prefNorm === tag || tag.includes(prefNorm) || prefNorm.includes(tag)) {
//           score += pref.weight * 2;
//           break;
//         }
//       }
//     }
    
//     score += activity.priority * 5;
//     return score;
//   };

//   // Handle route calculation callback from map
//   const handleRouteCalculated = (routes) => {
//     const newTravelTimes = new Map(travelTimes);
    
//     routes.forEach(route => {
//       const key = `${route.from}-${route.to}`;
//       const travelTimeMinutes = Math.ceil(route.duration / 60); // Convert seconds to minutes
//       newTravelTimes.set(key, travelTimeMinutes);
//     });
    
//     setTravelTimes(newTravelTimes);
//     setRouteData(routes);
//   };

//   // Handle activity card selection
//   const handleActivitySelect = (activity) => {
//     setSelectedActivity(activity);
//     if (!showMap) {
//       setShowMap(true);
//     }
//   };

//   // Fetch data from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // Fetch tourist info and preferences
//         const touristResponse = await axios.get(`http://localhost:5001/api/prefer/tourists/${touristId}`);
//         const allTourists = touristResponse.data;
        
//         // Find the specific tourist by ID
//         const currentTourist = allTourists.find(t => t.tourist_id === touristId);
        
//         if (!currentTourist) {
//           throw new Error(`Tourist with ID ${touristId} not found`);
//         }
        
//         const touristData = {
//           tourist_id: currentTourist.tourist_id,
//           tourist_name: currentTourist.name,
//           trip_start: currentTourist.trip_start,
//           trip_end: currentTourist.trip_end,
//           budget: currentTourist.budget,
//           preferred_start: currentTourist.preferred_start,
//           preferred_end: currentTourist.preferred_end,
//           preferred_dates: currentTourist.preferred_dates
//         };
//         console.log("TOURISTS DAYS",currentTourist.preferred_dates);
//         setTouristInfo(touristData);

//         // Process preferences
//         const processedPrefs = currentTourist.preferences && currentTourist.preferences.length > 0
//         ? currentTourist.preferences.map(pref => ({
//             category: pref.tag,
//             weight: pref.weight
//           }))
//         : [ //fallback preferences
//             { category: "Concert", weight: 10 },
//             { category: "Beach/River", weight: 9 },
//             { category: "Live Music", weight: 8 },
//             { category: "Indoor Adventure", weight: 7 },
//             { category: "Unique Food & Dining", weight: 6 },
//             { category: "Festival", weight: 5 },
//             { category: "Museum/Historical Site", weight: 4 },
//             { category: "Art/Talent", weight: 3 },
//             { category: "Outdoor Adventure", weight: 2 },
//             { category: "Local Food/Dining", weight: 1 }
//           ];
//         setPreferences(processedPrefs);
        
//         // Fetch venues and events
//         const [venuesResponse, eventsResponse] = await Promise.all([
//           axios.get('http://localhost:5001/api/venues'),
//           axios.get('http://localhost:5001/api/events')
//         ]);

//         // Get valid preferred dates within trip period
//         const tripStart = new Date(currentTourist.trip_start);
//         const tripEnd = new Date(currentTourist.trip_end);
//         const validPreferredDates = currentTourist.preferred_dates.filter(dateStr => {
//           const date = new Date(dateStr);
//           return date >= tripStart && date <= tripEnd;
//         });

//         console.log('Valid preferred dates for planning:', validPreferredDates);

//         // Process venues - Create instances ONLY for valid preferred days they're open
//         const processedVenues = [];
//         if (validPreferredDates.length > 0) {
//           for (const venue of venuesResponse.data) {
//             if (venue.is_active) {
//               for (const dateStr of validPreferredDates) {
//                 // Check if venue is open on this specific preferred day
//                 const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//                 const dateObj = new Date(dateStr);
//                 const dayName = dayNames[dateObj.getDay()];
                
//                 console.log(`Checking ${venue.name} for ${dateStr} (${dayName}):`, venue.days_open);
                
//                 if (venue.days_open && venue.days_open[dayName] === true) {
//                   // Get coordinates for the venue (with rate limiting)
//                   const coordinates = await geocodeAddress(venue.address);
                  
//                   processedVenues.push({
//                     id: `venue_${venue.venue_id}_${dateStr}`,
//                     name: venue.name,
//                     cost: parseFloat(venue.cost) || 0,
//                     duration: 180,
//                     date: dateStr, // This MUST be the exact preferred date
//                     start_time: venue.opening_time?.substring(0, 5) || '09:00',
//                     end_time: venue.closing_time?.substring(0, 5) || '17:00',
//                     tags: [venue.venue_type],
//                     priority: 2,
//                     type: 'venue',
//                     address: venue.address,
//                     description: venue.description,
//                     is_active: venue.is_active,
//                     days_open: venue.days_open,
//                     coordinates: coordinates
//                   });
                  
//                   console.log(`✓ Added ${venue.name} for preferred day ${dateStr}`, coordinates ? 'with coordinates' : 'without coordinates');
//                 } else {
//                   console.log(`✗ ${venue.name} closed on ${dayName} (${dateStr})`);
//                 }
//               }
//             }
//           }
//         }
        
//         // Process events - Only include events that occur exactly on valid preferred dates
//         const processedEvents = [];
//         for (const event of eventsResponse.data) {
//           const startDate = new Date(event.start_datetime);
//           const endDate = new Date(event.end_datetime);
//           const duration = Math.round((endDate - startDate) / (1000 * 60));
//           const eventDateStr = startDate.toISOString().split('T')[0];
          
//           // STRICT: Only include events on valid preferred dates
//           if (validPreferredDates.includes(eventDateStr)) {
//             // Get coordinates for the event venue (with rate limiting)
//             const coordinates = await geocodeAddress(event.venue_location);
            
//             processedEvents.push({
//               id: `event_${event.event_id}`,
//               name: event.name,
//               cost: parseFloat(event.cost) || 0,
//               duration: duration || 180,
//               date: eventDateStr,
//               start_time: startDate.toTimeString().substring(0, 5),
//               end_time: endDate.toTimeString().substring(0, 5),
//               tags: [event.event_type],
//               priority: 1,
//               type: 'event',
//               venue_location: event.venue_location,
//               description: event.description,
//               flyer_image_path: event.flyer_image_path,
//               coordinates: coordinates
//             });
            
//             console.log(`Event ${event.name} on ${eventDateStr}: Added to itinerary`, coordinates ? 'with coordinates' : 'without coordinates');
//           } else {
//             console.log(`Event ${event.name} on ${eventDateStr}: Not on preferred date`);
//           }
//         }

//         // Combine and filter activities
//         const allActivities = [...processedVenues, ...processedEvents];
        
//         console.log('Total venues processed:', processedVenues.length);
//         console.log('Total events processed:', processedEvents.length);
//         console.log('Valid preferred dates used for processing:', validPreferredDates);
//         console.log('Activities with coordinates:', allActivities.filter(act => act.coordinates).length);

//         setActivities(allActivities);
        
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError(err.message);
        
//         // Fallback data
//         setPreferences([
//           { category: "Concert", weight: 10 },
//           { category: "Beach/River", weight: 9 },
//           { category: "Live Music", weight: 8 },
//           { category: "Indoor Adventure", weight: 7 },
//           { category: "Unique Food & Dining", weight: 6 },
//           { category: "Festival", weight: 5 },
//           { category: "Museum/Historical Site", weight: 4 },
//           { category: "Art/Talent", weight: 3 },
//           { category: "Outdoor Adventure", weight: 2 },
//           { category: "Local Food/Dining", weight: 1 }
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchData();
   
//   }, [touristId]);

//   // Memory-efficient activity selection with venue diversity and travel time optimization
//   const selectOptimalActivities = (validActivities, budget, preferences) => {
//     console.log('Using optimized selection with travel time considerations...');
    
//     // Score and sort activities by value
//     const scoredActivities = validActivities.map(activity => ({
//       ...activity,
//       score: calculatePreferenceScore(activity),
//       efficiency: calculatePreferenceScore(activity) / Math.max(activity.cost, 1)
//     }));
    
//     // Sort by efficiency (score per dollar)
//     scoredActivities.sort((a, b) => b.efficiency - a.efficiency);
    
//     // Track used venue names to prevent duplicates
//     const usedVenueNames = new Set();
//     const selected = [];
//     let totalCost = 0;
    
//     for (const activity of scoredActivities) {
//       // Check budget constraint
//       if (totalCost + activity.cost > budget) continue;
      
//       // Check time conflicts (basic check first, travel time check later)
//       const hasConflict = selected.some(existing => hasTimeConflict(existing, activity));
//       if (hasConflict) continue;
      
//       // PREVENT VENUE DUPLICATES: Skip if we've already selected this venue
//       if (activity.type === 'venue') {
//         if (usedVenueNames.has(activity.name)) {
//           console.log(`Skipping duplicate venue: ${activity.name}`);
//           continue;
//         }
//       }
      
//       // Check daily activity limit (max 3 activities per day)
//       const sameDay = selected.filter(existing => existing.date === activity.date);
//       if (sameDay.length >= 3) continue;
      
//       // Add the activity
//       selected.push(activity);
//       totalCost += activity.cost;
      
//       // Track venue name if it's a venue
//       if (activity.type === 'venue') {
//         usedVenueNames.add(activity.name);
//         console.log(`✓ Added unique venue: ${activity.name} on ${activity.date}`);
//       } else {
//         console.log(`✓ Added event: ${activity.name} on ${activity.date}`);
//       }
      
//       // Stop if we have enough activities
//       if (selected.length >= 6) break;
//     }
    
//     console.log(`Selected ${selected.length} unique activities with total cost ${totalCost}`);
//     console.log('Selected venues:', Array.from(usedVenueNames));
//     return selected;
//   };

//   // Generate optimal itinerary - Memory-safe version
//   useEffect(() => {
//     if (activities.length > 0 && preferences.length > 0 && touristInfo) {
//       console.log('Generating itinerary for preferred days only...');
//       console.log('Total activities available:', activities.length);

//       // Filter activities that fit preferred time slots and dates
//       const validActivities = activities.filter(act => {
//         const fitsSlot = fitsPreferredSlot(act);
//         const fitsDate = fitsPreferredDate(act);
//         const isOpen = isVenueOpenOnActivityDate(act);
        
//         console.log(`${act.name} on ${act.date}: slot=${fitsSlot}, date=${fitsDate}, open=${isOpen}`);
        
//         return fitsSlot && fitsDate && isOpen;
//       });

//       console.log('Valid activities after filtering:', validActivities.length);

//       if (validActivities.length === 0) {
//         console.log('No valid activities found for preferred days and times');
//         setOptimalActivities([]);
//         return;
//       }

//       const budget = parseFloat(touristInfo.budget) || 1200;
      
//       // Use memory-efficient selection instead of combinations
//       const selectedActivities = selectOptimalActivities(validActivities, budget, preferences);
      
//       // Sort by date and time
//       const sortedActivities = selectedActivities.sort((a, b) => {
//         if (a.date !== b.date) return a.date.localeCompare(b.date);
//         return a.start_time.localeCompare(b.start_time);
//       });
      
//       console.log('Final optimal activities:', sortedActivities.length);
//       sortedActivities.forEach(act => {
//         console.log(`- ${act.name} on ${act.date} at ${act.start_time} (score: ${act.score}, cost: ${act.cost})`);
//       });
      
//       setOptimalActivities(sortedActivities);
//     }
//   }, [activities, preferences, touristInfo]);

//   // Debug logging
//   useEffect(() => {
//     if (!loading) {
//       console.log('Current state:', {
//         touristInfo,
//         preferences,
//         activities: activities.length,
//         optimalActivities: optimalActivities.length
//       });
//     }
//   }, [loading, touristInfo, preferences, activities, optimalActivities]);

//   // Get travel time between consecutive activities
//   const getTravelTimeBetween = (currentActivity, nextActivity) => {
//     if (!routeData.length) return null;
    
//     const route = routeData.find(r => r.from === currentActivity.id && r.to === nextActivity.id);
//     return route ? {
//       duration: route.durationText,
//       distance: route.distanceText
//     } : null;
//   };

//   // Render UI
//   const totalCost = optimalActivities.reduce((sum, act) => sum + act.cost, 0);
//   const budget = touristInfo?.budget ? parseFloat(touristInfo.budget) : 300;

//   return (
//     <div className="itinerary-planner-container">
//       <div className="p-6 max-w-5xl mx-auto bg-white">
//         <div className="itinerary-planner-header">
//           <h1 className="itinerary-planner-title">Tourist Itinerary Planner</h1>
//         </div>


//         {touristInfo && (
//           <div className="itinerary-tourist-info">
//             <div className="itinerary-tourist-info-header">
//               <div className="itinerary-tourist-info-icon">👤</div>
//               <h2 className="itinerary-tourist-info-title">Tourist Information</h2>
//             </div>
//             <div className="itinerary-tourist-info-grid">
//               <div className="itinerary-tourist-info-item">
//                 <div className="itinerary-tourist-info-label">📅 Trip</div>
//                 <div className="itinerary-tourist-info-value">
//                   {new Date(touristInfo.trip_start).toLocaleDateString('en-US', { 
//                     month: 'short', 
//                     day: 'numeric' 
//                   })} - {new Date(touristInfo.trip_end).toLocaleDateString('en-US', { 
//                     month: 'short', 
//                     day: 'numeric' 
//                   })}
//                 </div>
//               </div>
//               <div className="itinerary-tourist-info-item">
//                 <div className="itinerary-tourist-info-label">💰 Budget</div>
//                 <div className="itinerary-tourist-info-value">${budget}</div>
//               </div>
//               <div className="itinerary-tourist-info-item">
//                 <div className="itinerary-tourist-info-label">📌 Preferred Days</div>
//                 <div className="itinerary-tourist-info-value">
//                   {touristInfo.preferred_dates 
//                     ? touristInfo.preferred_dates.map(date => 
//                         new Date(date).toLocaleDateString('en-US', { 
//                           month: 'short', 
//                           day: 'numeric' 
//                         })
//                       ).join(', ')
//                     : 'None'
//                   }
//                 </div>
//               </div>
//               <div className="itinerary-tourist-info-item">
//                 <div className="itinerary-tourist-info-label">⏰ Hours</div>
//                 <div className="itinerary-tourist-info-value">
//                   {touristInfo.preferred_start?.substring(0, 5) || '09:00'} - {touristInfo.preferred_end?.substring(0, 5) || '18:00'}
//                 </div>
//               </div>
//             </div>
            
//             <div className="itinerary-valid-days-section">
//               <div className="itinerary-valid-days-label">Valid Planning Days:</div>
//               <div className="itinerary-valid-days-value">
//                 {(() => {
//                   const tripStart = new Date(touristInfo.trip_start);
//                   const tripEnd = new Date(touristInfo.trip_end);
//                   const validDays = touristInfo.preferred_dates.filter(dateStr => {
//                     const date = new Date(dateStr);
//                     return date >= tripStart && date <= tripEnd;
//                   });
//                   return validDays.length > 0 
//                     ? validDays.map(date => 
//                         new Date(date).toLocaleDateString('en-US', { 
//                           weekday: 'short',
//                           month: 'short', 
//                           day: 'numeric' 
//                         })
//                       ).join(', ')
//                     : 'None (no preferred days fall within trip period)';
//                 })()}
//               </div>
//             </div>
//           </div>
//         )}

//         {loading && (
//           <div className="itinerary-loading-container">
//             <div className="itinerary-loading-spinner"></div>
//            <div className="itinerary-loading-text">
//             Loading itinerary for {touristInfo?.tourist_name || `tourist #${touristId}`}...
//           </div>
//           </div>
//         )}

//         {error && (
//           <div className="itinerary-error-container">
//             <div className="itinerary-error-title">
//               ⚠️ Error
//             </div>
//             <p className="itinerary-error-message">Error: {error}</p>
//             <p className="itinerary-error-subtitle">Showing with fallback data</p>
//           </div>
//         )}
//         {/* Map Section */}
//         {showMap && optimalActivities.length > 0 && (
//           <div className="itinerary-map-section">
//             <div className="itinerary-map-header">
//               <h3 className="itinerary-map-title">
//                 <span className="itinerary-map-title-icon">🗺️</span>
//                 Route Visualization
//               </h3>
//               <button 
//                 onClick={() => setShowMap(false)}
//                 className="itinerary-nav-button secondary"
//               >
//                 Hide Map
//               </button>
//             </div>
//             <div className="itinerary-map-info">
//               <span className="itinerary-map-info-icon">💡</span>
//               Click on activity cards to see routes and travel times between locations.
//             </div>
//             <MapWithRouting 
//               activities={optimalActivities}
//               selectedActivity={selectedActivity}
//               onRouteCalculated={handleRouteCalculated}
//             />
//           </div>
//         )}

//         {!loading && optimalActivities.length > 0 && (
//           <div className="itinerary-recommendations-section">
//             <div className="itinerary-section-header">
//               <div className="itinerary-section-icon">📅</div>
//               <h2 className="itinerary-section-title">Recommended Itinerary</h2>
//             </div>
            
//             {/* Group activities by day and show them side by side */}
//             {(() => {
//               // Group activities by date
//               const activitiesByDay = optimalActivities.reduce((acc, activity) => {
//                 const date = activity.date;
//                 if (!acc[date]) {
//                   acc[date] = [];
//                 }
//                 acc[date].push(activity);
//                 return acc;
//               }, {});

//               // Sort activities within each day by start time
//               Object.keys(activitiesByDay).forEach(date => {
//                 activitiesByDay[date].sort((a, b) => a.start_time.localeCompare(b.start_time));
//               });

//               // Render each day with its activities
//               return Object.keys(activitiesByDay)
//                 .sort((a, b) => a.localeCompare(b))
//                 .map(date => (
//                   <div key={date} className="itinerary-day-activities-container">
//                     <div className="itinerary-day-header">
//                       <div className="itinerary-day-header-left">
//                         <div className="itinerary-day-indicator"></div>
//                         <h3 className="itinerary-day-title">
//                           {new Date(date).toLocaleDateString('en-US', { 
//                             weekday: 'long', 
//                             year: 'numeric', 
//                             month: 'long', 
//                             day: 'numeric' 
//                           })}
//                         </h3>
//                       </div>
//                       <div className="itinerary-day-activity-count">
//                         {activitiesByDay[date].length} {activitiesByDay[date].length === 1 ? 'Activity' : 'Activities'}
//                       </div>
//                     </div>
                    
//                     <div className="itinerary-day-activities-grid">
//                       {activitiesByDay[date].map((activity, index) => {
//                         const nextActivity = activitiesByDay[date][index + 1];
//                         const travelInfo = nextActivity ? getTravelTimeBetween(activity, nextActivity) : null;
                        
//                         return (
//                           <div key={activity.id}>
//                             <div 
//                               className={`itinerary-activity-card ${selectedActivity?.id === activity.id ? 'selected' : ''}`}
//                               onClick={() => handleActivitySelect(activity)}
//                             >
//                               <div className="itinerary-activity-header">
//                                 <div className="itinerary-activity-title-section">
//                                   <div className="itinerary-activity-time">
//                                     {activity.start_time}-{calculateEndTime(activity.start_time, activity.duration)}
//                                   </div>
//                                   <h4 className="itinerary-activity-name">{activity.name}</h4>
//                                 </div>
//                                 <div className="itinerary-activity-badges">
//                                   <span className={`itinerary-activity-type-badge ${activity.type}`}>
//                                     {activity.type.toUpperCase()}
//                                   </span>
//                                   {activity.cost > 0 && (
//                                     <span className="itinerary-activity-cost-badge">
//                                       ${activity.cost}
//                                     </span>
//                                   )}
//                                 </div>
//                               </div>
                              
//                               <div className="itinerary-activity-details">
//                                 <div className="itinerary-activity-info">
//                                   <div className="itinerary-activity-detail">
//                                     <span className="itinerary-activity-detail-label">Duration:</span>
//                                     <span className="itinerary-activity-detail-value">{activity.duration} minutes</span>
//                                   </div>
//                                   <div className="itinerary-activity-detail">
//                                     <span className="itinerary-activity-detail-label">Location:</span>
//                                     <span className="itinerary-activity-detail-value">{activity.address || activity.venue_location}</span>
//                                   </div>
//                                   <div className="itinerary-activity-detail">
//                                     <span className="itinerary-activity-detail-label">Category:</span>
//                                     <span className="itinerary-activity-detail-value">{activity.tags.join(', ')}</span>
//                                   </div>
//                                 </div>
//                                 <div>
//                                   {activity.description && (
//                                     <div className="itinerary-activity-description">
//                                       {activity.description}
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
                            
//                             {/* Travel time indicator between activities */}
//                             {travelInfo && (
//                               <div className="itinerary-travel-time">
//                                 <span className="itinerary-travel-time-icon">🚗</span>
//                                 Travel to next activity: {travelInfo.duration} ({travelInfo.distance})
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 ));
//             })()}

//             {/* Summary */}
//             <div className="itinerary-summary-section">
//               <div className="itinerary-summary-header">
//                 <div className="itinerary-summary-icon">📊</div>
//                 <h3 className="itinerary-summary-title">Itinerary Summary</h3>
//               </div>
//               <div className="itinerary-summary-grid">
//                 <div className="itinerary-summary-stat">
//                   <div className="itinerary-summary-stat-label">Total Activities</div>
//                   <div className="itinerary-summary-stat-value total-activities">{optimalActivities.length}</div>
//                 </div>
//                 <div className="itinerary-summary-stat">
//                   <div className="itinerary-summary-stat-label">Total Cost</div>
//                   <div className="itinerary-summary-stat-value total-cost">${totalCost.toFixed(2)}</div>
//                 </div>
//                 <div className="itinerary-summary-stat">
//                   <div className="itinerary-summary-stat-label">Budget Remaining</div>
//                   <div className="itinerary-summary-stat-value budget-remaining">${(budget - totalCost).toFixed(2)}</div>
//                 </div>
//                 <div className="itinerary-summary-stat">
//                   <div className="itinerary-summary-stat-label">Days Planned</div>
//                   <div className="itinerary-summary-stat-value days-planned">
//                     {new Set(optimalActivities.map(act => act.date)).size}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {!loading && optimalActivities.length === 0 && activities.length > 0 && (
//           <div className="itinerary-warning-state">
//             <div className="itinerary-warning-header">
//               <div className="itinerary-warning-icon">⚠️</div>
//               <div className="itinerary-warning-title">No optimal itinerary found</div>
//             </div>
//             <p className="itinerary-warning-message">No activities found for your preferred days and time slots.</p>
//             <div className="itinerary-warning-details">
//               <div className="itinerary-warning-details-item">• Available activities: {activities.length}</div>
//               <div className="itinerary-warning-details-item">• Budget: ${budget}</div>
//               <div className="itinerary-warning-details-item">• Try adjusting your preferred days, times, or budget</div>
//             </div>
//           </div>
//         )}

//         {!loading && activities.length === 0 && (
//           <div className="itinerary-empty-state">
//             <div className="itinerary-empty-icon">📋</div>
//             <div className="itinerary-empty-title">No activities available</div>
//             <p className="itinerary-empty-message">No activities found for your preferred days within the trip period.</p>
//           </div>
//         )}

//         {/* Floating Map Toggle Button */}
//         {!showMap && optimalActivities.length > 0 && (
//           <button 
//             className="itinerary-map-toggle"
//             onClick={() => setShowMap(true)}
//             title="Show Map"
//           >
//             🗺️
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ItineraryPlanner;

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import MapWithRouting from './MapWithRouting';
import "../css/itinerary.css";

const ItineraryPlanner = () => {
  const [activities, setActivities] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [touristInfo, setTouristInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [touristId, setTouristId] = useState(10);
  const [optimalActivities, setOptimalActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [routeData, setRouteData] = useState([]);
  const [travelTimes, setTravelTimes] = useState(new Map());

  // Geocoding cache to avoid repeated requests
  const geocodingCache = useMemo(() => new Map(), []);

  // Optimized geocoding with caching and controlled concurrency
  const geocodeAddress = useCallback(async (address) => {
    if (!address) return null;
    
    // Check cache first
    if (geocodingCache.has(address)) {
      return geocodingCache.get(address);
    }
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}, Jamaica&limit=1`,
        {
          headers: {
            'User-Agent': 'Jamaica Tourism Itinerary Planner'
          }
        }
      );
      const data = await response.json();
      
      const coordinates = data && data.length > 0 
        ? [parseFloat(data[0].lat), parseFloat(data[0].lon)]
        : null;
      
      // Cache the result
      geocodingCache.set(address, coordinates);
      return coordinates;
    } catch (error) {
      console.error('Geocoding error:', error);
      geocodingCache.set(address, null);
      return null;
    }
  }, [geocodingCache]);

  // Batch geocoding with controlled concurrency
  const batchGeocode = useCallback(async (addresses) => {
    const uniqueAddresses = [...new Set(addresses.filter(Boolean))];
    const results = new Map();
    
    // Process in batches of 3 to respect rate limits but speed up processing
    const batchSize = 3;
    for (let i = 0; i < uniqueAddresses.length; i += batchSize) {
      const batch = uniqueAddresses.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (address) => {
        await new Promise(resolve => setTimeout(resolve, 250)); // Reduced delay
        const coords = await geocodeAddress(address);
        return [address, coords];
      });
      
      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(([address, coords]) => {
        results.set(address, coords);
      });
    }
    
    return results;
  }, [geocodeAddress]);

  // Memoized helper functions
  const timeToMinutes = useCallback((timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }, []);

  const minutesToTime = useCallback((minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }, []);

  const calculateEndTime = useCallback((startTime, duration) => {
    const [h, m] = startTime.split(':').map(Number);
    const startMinutes = h * 60 + m;
    const endMinutes = startMinutes + duration;
    const hours = Math.floor(endMinutes / 60);
    const minutes = endMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }, []);

  const getTravelTime = useCallback((fromActivityId, toActivityId) => {
    const key = `${fromActivityId}-${toActivityId}`;
    return travelTimes.get(key) || 0;
  }, [travelTimes]);

  const hasTimeConflict = useCallback((act1, act2) => {
    if (act1.date !== act2.date) return false;
    const s1 = timeToMinutes(act1.start_time);
    const e1 = s1 + act1.duration;
    const s2 = timeToMinutes(act2.start_time);
    const e2 = s2 + act2.duration;
    return !(e1 <= s2 || e2 <= s1);
  }, [timeToMinutes]);

  // Memoized preference calculations
  const normalizeTag = useCallback((text) => {
    let normalized = text.toLowerCase().trim();
    normalized = normalized.replace(/[()&\-/]/g, ' ');
    normalized = normalized.replace(/\s+/g, ' ');
    normalized = normalized.replace(/s\b/g, '');
    return normalized.trim();
  }, []);

  const calculatePreferenceScore = useCallback((activity) => {
    let score = 0;
    const normTags = activity.tags.map(normalizeTag);
    
    for (const pref of preferences) {
      const prefNorm = normalizeTag(pref.category);
      for (const tag of normTags) {
        if (prefNorm === tag || tag.includes(prefNorm) || prefNorm.includes(tag)) {
          score += pref.weight * 2;
          break;
        }
      }
    }
    
    score += activity.priority * 5;
    return score;
  }, [preferences, normalizeTag]);

  // Memoized date validation functions
  const validPreferredDates = useMemo(() => {
    if (!touristInfo?.preferred_dates) return [];
    
    const tripStart = new Date(touristInfo.trip_start);
    const tripEnd = new Date(touristInfo.trip_end);
    
    return touristInfo.preferred_dates.filter(dateStr => {
      const date = new Date(dateStr);
      return date >= tripStart && date <= tripEnd;
    });
  }, [touristInfo?.preferred_dates, touristInfo?.trip_start, touristInfo?.trip_end]);

  const fitsPreferredSlot = useCallback((activity) => {
    if (!touristInfo) return false;
    const actStart = timeToMinutes(activity.start_time);
    const actEnd = actStart + activity.duration;
    const prefStart = timeToMinutes(touristInfo.preferred_start?.substring(0, 5)) || timeToMinutes('09:00');
    const prefEnd = timeToMinutes(touristInfo.preferred_end?.substring(0, 5)) || timeToMinutes('18:00');
    return (actStart <= prefEnd) && (actEnd >= prefStart);
  }, [touristInfo, timeToMinutes]);

  const fitsPreferredDate = useCallback((activity) => {
    if (!validPreferredDates.length) return true;
    
    let activityDateStr;
    if (activity.date instanceof Date) {
      activityDateStr = activity.date.toISOString().split('T')[0];
    } else if (typeof activity.date === 'string') {
      activityDateStr = activity.date.split('T')[0];
    } else {
      return false;
    }

    return validPreferredDates.includes(activityDateStr);
  }, [validPreferredDates]);

  const isVenueOpenOnActivityDate = useCallback((activity) => {
    if (activity.type === 'event') return true;

    if (activity.type === 'venue') {
      const activityDate = new Date(activity.date);
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = dayNames[activityDate.getDay()];
      return activity.days_open[dayName] === true;
    }

    return false;
  }, []);

  // Handle route calculation callback from map
  const handleRouteCalculated = useCallback((routes) => {
    const newTravelTimes = new Map(travelTimes);
    
    routes.forEach(route => {
      const key = `${route.from}-${route.to}`;
      const travelTimeMinutes = Math.ceil(route.duration / 60);
      newTravelTimes.set(key, travelTimeMinutes);
    });
    
    setTravelTimes(newTravelTimes);
    setRouteData(routes);
  }, [travelTimes]);

  // Handle activity card selection
  const handleActivitySelect = useCallback((activity) => {
    setSelectedActivity(activity);
    if (!showMap) {
      setShowMap(true);
    }
  }, [showMap]);

  // Optimized activity selection
  const selectOptimalActivities = useCallback((validActivities, budget, preferences) => {
    // Score all activities once
    const scoredActivities = validActivities.map(activity => {
      const score = calculatePreferenceScore(activity);
      return {
        ...activity,
        score,
        efficiency: score / Math.max(activity.cost, 1)
      };
    });
    
    // Sort by efficiency
    scoredActivities.sort((a, b) => b.efficiency - a.efficiency);
    
    const usedVenueNames = new Set();
    const selected = [];
    let totalCost = 0;
    
    for (const activity of scoredActivities) {
      // Early exits for performance
      if (totalCost + activity.cost > budget) continue;
      if (selected.length >= 6) break;
      
      // Check conflicts
      if (selected.some(existing => hasTimeConflict(existing, activity))) continue;
      
      // Prevent venue duplicates
      if (activity.type === 'venue' && usedVenueNames.has(activity.name)) continue;
      
      // Check daily activity limit
      const sameDay = selected.filter(existing => existing.date === activity.date);
      if (sameDay.length >= 3) continue;
      
      // Add the activity
      selected.push(activity);
      totalCost += activity.cost;
      
      if (activity.type === 'venue') {
        usedVenueNames.add(activity.name);
      }
    }
    
    return selected;
  }, [calculatePreferenceScore, hasTimeConflict]);

  // Main data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch tourist info and preferences
        const touristResponse = await axios.get(`http://localhost:5001/api/prefer/tourists/${touristId}`);
        const allTourists = touristResponse.data;
        const currentTourist = allTourists.find(t => t.tourist_id === touristId);
        
        if (!currentTourist) {
          throw new Error(`Tourist with ID ${touristId} not found`);
        }
        
        const touristData = {
          tourist_id: currentTourist.tourist_id,
          tourist_name: currentTourist.name,
          trip_start: currentTourist.trip_start,
          trip_end: currentTourist.trip_end,
          budget: currentTourist.budget,
          preferred_start: currentTourist.preferred_start,
          preferred_end: currentTourist.preferred_end,
          preferred_dates: currentTourist.preferred_dates
        };
        
        setTouristInfo(touristData);

        // Process preferences
        const processedPrefs = currentTourist.preferences?.length > 0
          ? currentTourist.preferences.map(pref => ({
              category: pref.tag,
              weight: pref.weight
            }))
          : [
              { category: "Concert", weight: 10 },
              { category: "Beach/River", weight: 9 },
              { category: "Live Music", weight: 8 },
              { category: "Indoor Adventure", weight: 7 },
              { category: "Unique Food & Dining", weight: 6 },
              { category: "Festival", weight: 5 },
              { category: "Museum/Historical Site", weight: 4 },
              { category: "Art/Talent", weight: 3 },
              { category: "Outdoor Adventure", weight: 2 },
              { category: "Local Food/Dining", weight: 1 }
            ];
        setPreferences(processedPrefs);
        
        // Fetch venues and events in parallel
        const [venuesResponse, eventsResponse] = await Promise.all([
          axios.get('http://localhost:5001/api/venues'),
          axios.get('http://localhost:5001/api/events')
        ]);

        // Calculate valid preferred dates
        const tripStart = new Date(currentTourist.trip_start);
        const tripEnd = new Date(currentTourist.trip_end);
        const validDates = currentTourist.preferred_dates.filter(dateStr => {
          const date = new Date(dateStr);
          return date >= tripStart && date <= tripEnd;
        });

        if (validDates.length === 0) {
          setActivities([]);
          return;
        }

        // Collect all addresses for batch geocoding
        const allAddresses = [
          ...venuesResponse.data.filter(v => v.is_active).map(v => v.address),
          ...eventsResponse.data.map(e => e.venue_location)
        ];

        // Batch geocode all addresses
        const geocodedAddresses = await batchGeocode(allAddresses);

        // Process venues - optimized
        const processedVenues = [];
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        
        for (const venue of venuesResponse.data) {
          if (!venue.is_active) continue;
          
          const coordinates = geocodedAddresses.get(venue.address);
          
          for (const dateStr of validDates) {
            const dateObj = new Date(dateStr);
            const dayName = dayNames[dateObj.getDay()];
            
            if (venue.days_open?.[dayName] === true) {
              processedVenues.push({
                id: `venue_${venue.venue_id}_${dateStr}`,
                name: venue.name,
                cost: parseFloat(venue.cost) || 0,
                duration: 180,
                date: dateStr,
                start_time: venue.opening_time?.substring(0, 5) || '09:00',
                end_time: venue.closing_time?.substring(0, 5) || '17:00',
                tags: [venue.venue_type],
                priority: 2,
                type: 'venue',
                address: venue.address,
                description: venue.description,
                is_active: venue.is_active,
                days_open: venue.days_open,
                coordinates: coordinates
              });
            }
          }
        }
        
        // Process events - optimized
        const processedEvents = eventsResponse.data
          .map(event => {
            const startDate = new Date(event.start_datetime);
            const endDate = new Date(event.end_datetime);
            const eventDateStr = startDate.toISOString().split('T')[0];
            
            if (!validDates.includes(eventDateStr)) return null;
            
            const coordinates = geocodedAddresses.get(event.venue_location);
            const duration = Math.round((endDate - startDate) / (1000 * 60));
            
            return {
              id: `event_${event.event_id}`,
              name: event.name,
              cost: parseFloat(event.cost) || 0,
              duration: duration || 180,
              date: eventDateStr,
              start_time: startDate.toTimeString().substring(0, 5),
              end_time: endDate.toTimeString().substring(0, 5),
              tags: [event.event_type],
              priority: 1,
              type: 'event',
              venue_location: event.venue_location,
              description: event.description,
              flyer_image_path: event.flyer_image_path,
              coordinates: coordinates
            };
          })
          .filter(Boolean);

        setActivities([...processedVenues, ...processedEvents]);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        
        // Fallback preferences
        setPreferences([
          { category: "Concert", weight: 10 },
          { category: "Beach/River", weight: 9 },
          { category: "Live Music", weight: 8 },
          { category: "Indoor Adventure", weight: 7 },
          { category: "Unique Food & Dining", weight: 6 },
          { category: "Festival", weight: 5 },
          { category: "Museum/Historical Site", weight: 4 },
          { category: "Art/Talent", weight: 3 },
          { category: "Outdoor Adventure", weight: 2 },
          { category: "Local Food/Dining", weight: 1 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [touristId, batchGeocode]);

  // Memoized optimal activities calculation
  const calculatedOptimalActivities = useMemo(() => {
    if (activities.length === 0 || preferences.length === 0 || !touristInfo) {
      return [];
    }

    // Filter activities in a single pass
    const validActivities = activities.filter(act => 
      fitsPreferredSlot(act) && 
      fitsPreferredDate(act) && 
      isVenueOpenOnActivityDate(act)
    );

    if (validActivities.length === 0) return [];

    const budget = parseFloat(touristInfo.budget) || 1200;
    const selectedActivities = selectOptimalActivities(validActivities, budget, preferences);
    
    // Sort by date and time
    return selectedActivities.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.start_time.localeCompare(b.start_time);
    });
  }, [activities, preferences, touristInfo, fitsPreferredSlot, fitsPreferredDate, isVenueOpenOnActivityDate, selectOptimalActivities]);

  // Update optimal activities when calculation changes
  useEffect(() => {
    setOptimalActivities(calculatedOptimalActivities);
  }, [calculatedOptimalActivities]);

  // Memoized derived values
  const { totalCost, budget, activitiesByDay } = useMemo(() => {
    const cost = optimalActivities.reduce((sum, act) => sum + act.cost, 0);
    const budgetValue = touristInfo?.budget ? parseFloat(touristInfo.budget) : 300;
    
    // Group activities by day
    const grouped = optimalActivities.reduce((acc, activity) => {
      const date = activity.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(activity);
      return acc;
    }, {});

    // Sort activities within each day
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => a.start_time.localeCompare(b.start_time));
    });

    return { 
      totalCost: cost, 
      budget: budgetValue, 
      activitiesByDay: grouped 
    };
  }, [optimalActivities, touristInfo?.budget]);

  const getTravelTimeBetween = useCallback((currentActivity, nextActivity) => {
    if (!routeData.length) return null;
    
    const route = routeData.find(r => r.from === currentActivity.id && r.to === nextActivity.id);
    return route ? {
      duration: route.durationText,
      distance: route.distanceText
    } : null;
  }, [routeData]);

  return (
    <div className="itinerary-planner-container">
      <div className="p-6 max-w-5xl mx-auto bg-white">
        <div className="itinerary-planner-header">
          <h1 className="itinerary-planner-title">Tourist Itinerary Planner</h1>
        </div>

        {touristInfo && (
          <div className="itinerary-tourist-info">
            <div className="itinerary-tourist-info-header">
              <div className="itinerary-tourist-info-icon">👤</div>
              <h2 className="itinerary-tourist-info-title">Tourist Information</h2>
            </div>
            <div className="itinerary-tourist-info-grid">
              <div className="itinerary-tourist-info-item">
                <div className="itinerary-tourist-info-label">📅 Trip</div>
                <div className="itinerary-tourist-info-value">
                  {new Date(touristInfo.trip_start).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })} - {new Date(touristInfo.trip_end).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <div className="itinerary-tourist-info-item">
                <div className="itinerary-tourist-info-label">💰 Budget</div>
                <div className="itinerary-tourist-info-value">${budget}</div>
              </div>
              <div className="itinerary-tourist-info-item">
                <div className="itinerary-tourist-info-label">📌 Preferred Days</div>
                <div className="itinerary-tourist-info-value">
                  {touristInfo.preferred_dates 
                    ? touristInfo.preferred_dates.map(date => 
                        new Date(date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })
                      ).join(', ')
                    : 'None'
                  }
                </div>
              </div>
              <div className="itinerary-tourist-info-item">
                <div className="itinerary-tourist-info-label">⏰ Hours</div>
                <div className="itinerary-tourist-info-value">
                  {touristInfo.preferred_start?.substring(0, 5) || '09:00'} - {touristInfo.preferred_end?.substring(0, 5) || '18:00'}
                </div>
              </div>
            </div>
            
            <div className="itinerary-valid-days-section">
              <div className="itinerary-valid-days-label">Valid Planning Days:</div>
              <div className="itinerary-valid-days-value">
                {validPreferredDates.length > 0 
                  ? validPreferredDates.map(date => 
                      new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric' 
                      })
                    ).join(', ')
                  : 'None (no preferred days fall within trip period)'
                }
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="itinerary-loading-container">
            <div className="itinerary-loading-spinner"></div>
            <div className="itinerary-loading-text">
              Loading itinerary for {touristInfo?.tourist_name || `tourist #${touristId}`}...
            </div>
          </div>
        )}

        {error && (
          <div className="itinerary-error-container">
            <div className="itinerary-error-title">⚠️ Error</div>
            <p className="itinerary-error-message">Error: {error}</p>
            <p className="itinerary-error-subtitle">Showing with fallback data</p>
          </div>
        )}

        {/* Map Section */}
        {showMap && optimalActivities.length > 0 && (
          <div className="itinerary-map-section">
            <div className="itinerary-map-header">
              <h3 className="itinerary-map-title">
                <span className="itinerary-map-title-icon">🗺️</span>
                Route Visualization
              </h3>
              <button 
                onClick={() => setShowMap(false)}
                className="itinerary-nav-button secondary"
              >
                Hide Map
              </button>
            </div>
            <div className="itinerary-map-info">
              <span className="itinerary-map-info-icon">💡</span>
              Click on activity cards to see routes and travel times between locations.
            </div>
            <MapWithRouting 
              activities={optimalActivities}
              selectedActivity={selectedActivity}
              onRouteCalculated={handleRouteCalculated}
            />
          </div>
        )}

        {!loading && optimalActivities.length > 0 && (
          <div className="itinerary-recommendations-section">
            <div className="itinerary-section-header">
              <div className="itinerary-section-icon">📅</div>
              <h2 className="itinerary-section-title">Recommended Itinerary</h2>
            </div>
            
            {Object.keys(activitiesByDay)
              .sort((a, b) => a.localeCompare(b))
              .map(date => (
                <div key={date} className="itinerary-day-activities-container">
                  <div className="itinerary-day-header">
                    <div className="itinerary-day-header-left">
                      <div className="itinerary-day-indicator"></div>
                      <h3 className="itinerary-day-title">
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h3>
                    </div>
                    <div className="itinerary-day-activity-count">
                      {activitiesByDay[date].length} {activitiesByDay[date].length === 1 ? 'Activity' : 'Activities'}
                    </div>
                  </div>
                  
                  <div className="itinerary-day-activities-grid">
                    {activitiesByDay[date].map((activity, index) => {
                      const nextActivity = activitiesByDay[date][index + 1];
                      const travelInfo = nextActivity ? getTravelTimeBetween(activity, nextActivity) : null;
                      
                      return (
                        <div key={activity.id}>
                          <div 
                            className={`itinerary-activity-card ${selectedActivity?.id === activity.id ? 'selected' : ''}`}
                            onClick={() => handleActivitySelect(activity)}
                          >
                            <div className="itinerary-activity-header">
                              <div className="itinerary-activity-title-section">
                                <div className="itinerary-activity-time">
                                  {activity.start_time}-{calculateEndTime(activity.start_time, activity.duration)}
                                </div>
                                <h4 className="itinerary-activity-name">{activity.name}</h4>
                              </div>
                              <div className="itinerary-activity-badges">
                                <span className={`itinerary-activity-type-badge ${activity.type}`}>
                                  {activity.type.toUpperCase()}
                                </span>
                                {activity.cost > 0 && (
                                  <span className="itinerary-activity-cost-badge">
                                    ${activity.cost}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="itinerary-activity-details">
                              <div className="itinerary-activity-info">
                                <div className="itinerary-activity-detail">
                                  <span className="itinerary-activity-detail-label">Duration:</span>
                                  <span className="itinerary-activity-detail-value">{activity.duration} minutes</span>
                                </div>
                                <div className="itinerary-activity-detail">
                                  <span className="itinerary-activity-detail-label">Location:</span>
                                  <span className="itinerary-activity-detail-value">{activity.address || activity.venue_location}</span>
                                </div>
                                <div className="itinerary-activity-detail">
                                  <span className="itinerary-activity-detail-label">Category:</span>
                                  <span className="itinerary-activity-detail-value">{activity.tags.join(', ')}</span>
                                </div>
                              </div>
                              <div>
                                {activity.description && (
                                  <div className="itinerary-activity-description">
                                    {activity.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {travelInfo && (
                            <div className="itinerary-travel-time">
                              <span className="itinerary-travel-time-icon">🚗</span>
                              Travel to next activity: {travelInfo.duration} ({travelInfo.distance})
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

            {/* Summary */}
            <div className="itinerary-summary-section">
              <div className="itinerary-summary-header">
                <div className="itinerary-summary-icon">📊</div>
                <h3 className="itinerary-summary-title">Itinerary Summary</h3>
              </div>
              <div className="itinerary-summary-grid">
                <div className="itinerary-summary-stat">
                  <div className="itinerary-summary-stat-label">Total Activities</div>
                  <div className="itinerary-summary-stat-value total-activities">{optimalActivities.length}</div>
                </div>
                <div className="itinerary-summary-stat">
                  <div className="itinerary-summary-stat-label">Total Cost</div>
                  <div className="itinerary-summary-stat-value total-cost">${totalCost.toFixed(2)}</div>
                </div>
                <div className="itinerary-summary-stat">
                  <div className="itinerary-summary-stat-label">Budget Remaining</div>
                  <div className="itinerary-summary-stat-value budget-remaining">${(budget - totalCost).toFixed(2)}</div>
                </div>
                <div className="itinerary-summary-stat">
                  <div className="itinerary-summary-stat-label">Days Planned</div>
                  <div className="itinerary-summary-stat-value days-planned">
                    {Object.keys(activitiesByDay).length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && optimalActivities.length === 0 && activities.length > 0 && (
          <div className="itinerary-warning-state">
            <div className="itinerary-warning-header">
              <div className="itinerary-warning-icon">⚠️</div>
              <div className="itinerary-warning-title">No optimal itinerary found</div>
            </div>
            <p className="itinerary-warning-message">No activities found for your preferred days and time slots.</p>
            <div className="itinerary-warning-details">
              <div className="itinerary-warning-details-item">• Available activities: {activities.length}</div>
              <div className="itinerary-warning-details-item">• Budget: ${budget}</div>
              <div className="itinerary-warning-details-item">• Try adjusting your preferred days, times, or budget</div>
            </div>
          </div>
        )}

        {!loading && activities.length === 0 && (
          <div className="itinerary-empty-state">
            <div className="itinerary-empty-icon">📋</div>
            <div className="itinerary-empty-title">No activities available</div>
            <p className="itinerary-empty-message">No activities found for your preferred days within the trip period.</p>
          </div>
        )}

        {/* Floating Map Toggle Button */}
        {!showMap && optimalActivities.length > 0 && (
          <button 
            className="itinerary-map-toggle"
            onClick={() => setShowMap(true)}
            title="Show Map"
          >
            🗺️
          </button>
        )}
      </div>
    </div>
  );
};

export default ItineraryPlanner;