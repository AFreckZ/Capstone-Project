// //working but not spreading venues across days
//  import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ItineraryPlanner = () => {
//   const [activities, setActivities] = useState([]);
//   const [preferences, setPreferences] = useState([]);
//   const [touristInfo, setTouristInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [touristId, setTouristId] = useState(10);
//   const [optimalActivities, setOptimalActivities] = useState([]);

//   // Helper functions
//   const timeToMinutes = (timeStr) => {
//     const [h, m] = timeStr.split(':').map(Number);
//     return h * 60 + m;
//   };
//   //enusres the activities dont clash
//   const hasTimeConflict = (act1, act2) => {
//     if (act1.date !== act2.date) return false;
//     const s1 = timeToMinutes(act1.start_time);
//     const e1 = s1 + act1.duration;
//     const s2 = timeToMinutes(act2.start_time);
//     const e2 = s2 + act2.duration;
//     return !(e1 <= s2 || e2 <= s1);
//   };

//   //ensuring the activities are within a certain time frame
//   const fitsPreferredSlot = (activity) => {
//     if (!touristInfo) return false;
//     const actStart = timeToMinutes(activity.start_time);
//     const actEnd = actStart + activity.duration;
//     const prefStart = timeToMinutes(touristInfo.preferred_start?.substring(0, 5)) || timeToMinutes('09:00');
//     const prefEnd = timeToMinutes(touristInfo.preferred_end?.substring(0, 5))|| timeToMinutes('18:00');
//     const overlaps = (actStart <= prefEnd) && (actEnd >= prefStart);
//     console.log(`Activity: ${activity.name}, Start: ${actStart}, End: ${actEnd}, PrefStart: ${prefStart}, PrefEnd: ${prefEnd}`);
    

//   return overlaps;
//   };
//  const fitsPreferredDate = (activity) => {
//   if (!touristInfo || !touristInfo.preferred_dates) return true;

//   if (activity.type === 'event') {
//     let activityDateStr;
//     if (activity.date instanceof Date) {
//       activityDateStr = activity.date.toISOString().split('T')[0];
//     } else if (typeof activity.date === 'string') {
//       activityDateStr = activity.date.split('T')[0];
//     } else {
//       return false;
//     }
//     return touristInfo.preferred_dates.includes(activityDateStr);
//   }

//   if (activity.type === 'venue') {
//     const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//     // NO JSON.parse here since days_open is already an object
//     const daysOpen = activity.days_open;

//     return touristInfo.preferred_dates.some(dateStr => {
//       const date = new Date(dateStr);
//       const dayName = dayNames[date.getDay()];
//       return daysOpen[dayName] === true;
//     });
//   }

//   return false;
// };


//   //ensures the venues are open on certain days
//   const isVenueOpenOnActivityDate = (activity) => {
//   if (activity.type === 'event') return true;

//   if (activity.type === 'venue') {
//     const activityDate = new Date(activity.date);
//     const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//     const dayName = dayNames[activityDate.getDay()];

//     // days_open is already an object, no need to parse:
//     const daysOpen = activity.days_open;

//     return daysOpen[dayName] === true;
//   }

//   return false;
// };

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

//   const combinations = (arr, r) => {
//     if (r === 0) return [[]];
//     if (r > arr.length) return [];
//     const [first, ...rest] = arr;
//     const withFirst = combinations(rest, r - 1).map(combo => [first, ...combo]);
//     const withoutFirst = combinations(rest, r);
//     return [...withFirst, ...withoutFirst];
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
//           trip_start: currentTourist.trip_start,
//           trip_end: currentTourist.trip_end,
//           budget: currentTourist.budget,
//           preferred_start: currentTourist.preferred_start,
//           preferred_end: currentTourist.preferred_end,
//           preferred_dates: currentTourist.preferred_dates
//         };
        
//         setTouristInfo(touristData);
//         // console.log('Trip Start:', currentTourist.trip_start);
//         // console.log('Trip End:', currentTourist.trip_end);

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
//         //checking if the routes are working
//         // console.log('Venues response:', venuesResponse.data);
//         // console.log('Events response:', eventsResponse.data);
//         // Process venues
//         const processedVenues = venuesResponse.data.map(venue => ({
//           id: `venue_${venue.venue_id}`,
//           name: venue.name,
//           cost: parseFloat(venue.cost) || 0,
//           duration: 180,
//           start_time: venue.opening_time?.substring(0, 5) || '09:00',
//           end_time: venue.closing_time?.substring(0, 5) || '17:00',
//           tags: [venue.venue_type],
//           priority: 2,
//           type: 'venue',
//           address: venue.address,
//           description: venue.description,
//           is_active: venue.is_active,
//           days_open: venue.days_open
//         })).filter(venue => venue.is_active);
        
//         // Process events
//         const processedEvents = eventsResponse.data.map(event => {
//           const startDate = new Date(event.start_datetime);
//           const endDate = new Date(event.end_datetime);
//           const duration = Math.round((endDate - startDate) / (1000 * 60));
          
//           return {
//             id: `event_${event.event_id}`,
//             name: event.name,
//             cost: parseFloat(event.cost) || 0,
//             duration: duration || 180,
//             date: startDate.toISOString().split('T')[0],
//             start_time: startDate.toTimeString().substring(0, 5),
//             end_time: endDate.toTimeString().substring(0, 5),
//             tags: [event.event_type],
//             priority: 1,
//             type: 'event',
//             venue_location: event.venue_location,
//             description: event.description,
//             flyer_image_path: event.flyer_image_path
//           };
//         });
//         //checking if the venues and events were processed 
//         // console.log('Processed Venues:', processedVenues);
//         // console.log('Processed Events:', processedEvents);

//         // Combine and filter activities
        
//         const allActivities = [...processedVenues, ...processedEvents];
//         if (currentTourist.trip_start && currentTourist.trip_end) {
//           const tripStart = new Date(currentTourist.trip_start);
//           const tripEnd = new Date(currentTourist.trip_end);
//           const filteredActivities = allActivities.filter(activity => {
//           if (activity.date) {
//             const activityDate = new Date(activity.date);
//             return activityDate >= tripStart && activityDate <= tripEnd;
//           }
//           // If no date (i.e., it's a venue), include it
//           return true;
//         });
//         console.log("Filtered Activities:", filteredActivities);

//           // const filteredActivities = allActivities.filter(activity => {
//           //   const activityDate = new Date(activity.date);
//           //   return activityDate >= tripStart && activityDate <= tripEnd;
//           // });
//           //console.log('All activities before date filter:', allActivities);
//           //console.log(' these are the filtered activities', filteredActivities)
//           setActivities(filteredActivities);
//         } else {
//           setActivities(allActivities);
//         }
        
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


//   // Generate optimal itinerary
//   useEffect(() => {
//     if (activities.length > 0 && preferences.length > 0 && touristInfo) {
//       console.log('Generating itinerary with:', {
//         activities,
//         preferences,
//         touristInfo
//       });
//       // Assign dates to venues that don't have them
// const activitiesWithDates = activities.map(act => {
//   if (!act.date && act.type === 'venue') {
//     // Find first preferred date within trip range
//     const tripStart = new Date(touristInfo.trip_start);
//     const tripEnd = new Date(touristInfo.trip_end);
    
//     const validPreferredDate = touristInfo.preferred_dates?.find(dateStr => {
//       const date = new Date(dateStr);
//       return date >= tripStart && date <= tripEnd;
//     });
    
//     if (validPreferredDate) {
//       return { ...act, date: validPreferredDate };
//     } else {
//       // Fallback to first day of trip
//       return { ...act, date: tripStart.toISOString().split('T')[0] };
//     }
//   }
//   return act;
// });

// const validActivities = activitiesWithDates.filter(
//   act => fitsPreferredSlot(act) && fitsPreferredDate(act)
// );
//       // console.log('All activities:', activities);
//       // console.log('Tourist trip dates:', touristInfo.trip_start, touristInfo.trip_end);
//       // console.log('Tourist preferred days:', touristInfo.preferred_dates);
//       // console.log('Tourist budget:', touristInfo.budget);
//     //  const validActivities = activities.filter(
//     //   act => fitsPreferredSlot(act) &&
//     //         fitsPreferredDate(act) //
//          //isVenueOpenOnActivityDate(act)
// // );
//       // console.log('Preferred Dates:', touristInfo.preferred_dates);
//       // activities.forEach(act => {
//       //   console.log('Activity date:', act.date, 'Is preferred?', touristInfo.preferred_dates.includes(act.date));
//       // });console.log('Valid activities count:', validActivities.length);
// activities.forEach(act => {
//   console.log(
//     'Activity:', act.name,
//     'Preferred slot:', fitsPreferredSlot(act),
//     'Preferred date:', fitsPreferredDate(act)
//   );
// });

//       let bestCombo = [];
//       let bestScore = 0;
//       const budget = parseFloat(touristInfo.budget) || 300;
//       console.log('Valid activities within preferred slot:', validActivities);
//       if (validActivities.length === 0) {
//         console.log('No valid activities after time filtering.');
//         setOptimalActivities([]); 
//         return;
//       }
//       console.log('Valid activities:', validActivities);


//       // if (validActivities.length === 0) {
//       //   console.log('No valid activities for this day');
//       // } else {
//       //   const chosenActivity = validActivities[Math.floor(Math.random() * validActivities.length)];
//       //   console.log('Chosen activity:', chosenActivity);
//       // }


//       for (let r = 1; r <= Math.min(validActivities.length, 10); r++) {
//         const combos = combinations(validActivities, r);
//         for (const combo of combos) {
//           const cost = combo.reduce((sum, a) => sum + a.cost, 0);
//           if (cost > budget) continue;
          
//           const conflict = combo.some((act1, i) => 
//             combo.slice(i + 1).some(act2 => hasTimeConflict(act1, act2))
//           );
//           if (conflict) continue;
          
//           const preferenceScore = combo.reduce((sum, a) => sum + calculatePreferenceScore(a), 0);
//           const costEfficiencyScore = cost > 0 ? preferenceScore / cost : preferenceScore;
//           const totalScore = preferenceScore + costEfficiencyScore * 0.1;
          
//           if (totalScore > bestScore || (totalScore === bestScore && combo.length > bestCombo.length)) {
//             bestCombo = combo;
//             bestScore = totalScore;
//           }
//         }
//       }
      
//       const sortedCombo = bestCombo.sort((a, b) => {
//         if (a.date !== b.date) return a.date.localeCompare(b.date);
//         return a.start_time.localeCompare(b.start_time);
//       });
      
//       setOptimalActivities(sortedCombo);
//     }
//   }, [activities, preferences, touristInfo]);
  

//   // Debug logging
//   useEffect(() => {
//     if (!loading) {
//       console.log('Current state:', {
//         touristInfo,
//         preferences,
//         activities,
//         optimalActivities
//       });
//     }
//   }, [loading, touristInfo, preferences, activities, optimalActivities]);

//   // Render UI
//   const totalCost = optimalActivities.reduce((sum, act) => sum + act.cost, 0);
//   const budget = touristInfo?.budget ? parseFloat(touristInfo.budget) : 300;

//   return (
//     <div className="p-6 max-w-5xl mx-auto bg-white">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold text-blue-800">Tourist Itinerary Planner</h1>
//       </div>

//       {loading && (
//         <div className="text-center py-8">
//           <div className="text-lg">Loading itinerary for tourist #{touristId}...</div>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           <p>Error: {error}</p>
//           <p className="text-sm mt-2">Showing with fallback data</p>
//         </div>
//       )}

//       {touristInfo && (
//         <div className="bg-blue-50 p-4 rounded-lg mb-6">
//           <h2 className="text-lg font-semibold mb-2">Tourist Information</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
//           <div>
//             <span className="font-medium">Trip:</span> {
//               new Date(touristInfo.trip_start).toLocaleDateString('en-US', { 
//                 year: 'numeric', 
//                 month: 'short', 
//                 day: 'numeric' 
//               })
//             } to {
//               new Date(touristInfo.trip_end).toLocaleDateString('en-US', { 
//                 year: 'numeric', 
//                 month: 'short', 
//                 day: 'numeric' 
//               })
//             }
//           </div>            <div><span className="font-medium">Budget:</span> ${budget}</div>
//             <div><span className="font-medium">Preferred Days:</span> {
//               touristInfo.preferred_dates 
//                 ? touristInfo.preferred_dates.map(date => 
//                     new Date(date).toLocaleDateString('en-US', { 
//                       month: 'short', 
//                       day: 'numeric' 
//                     })
//                   ).join(', ')
//                 : 'None specified'
//             }</div>            
//             <div><span className="font-medium">Preferred Hours:</span> {touristInfo.preferred_start?.substring(0, 5) || '09:00'} - {touristInfo.preferred_end?.substring(0, 5) || '18:00'}</div>
//           </div>
//         </div>
//       )}

//       {!loading && optimalActivities.length > 0 ? (
//   <div className="bg-green-50 p-4 rounded-lg mb-6">
//     <h2 className="text-lg font-semibold mb-3">Optimized Itinerary</h2>
//     <ul className="space-y-3">
//       {optimalActivities.map((activity) => (
//         <li key={activity.id} className="border p-3 rounded-lg shadow-sm">
//           <h3 className="font-bold text-blue-700">{activity.name}</h3>
//           <p className="text-sm"><span className="font-medium">Type:</span> {activity.type}</p>
//           <p className="text-sm">
//             <span className="font-medium">Date:</span> {activity.date}
//           </p>
//           <p className="text-sm">
//             <span className="font-medium">Time:</span> {activity.start_time} - {activity.end_time}
//           </p>
//           <p className="text-sm"><span className="font-medium">Cost:</span> ${activity.cost}</p>
//           {activity.type === 'venue' && (
//             <p className="text-sm"><span className="font-medium">Address:</span> {activity.address}</p>
//           )}
//           <p className="text-sm text-gray-600">Description: {activity.description} </p>
//           <p className="text-sm text-gray-600"> Activity Tag: {activity.tag} </p>
//         </li>
//       ))}
//     </ul>
//     <div className="font-bold mt-4 text-green-800">
//       Total Cost: ${totalCost.toFixed(2)} / ${budget}
//     </div>
//   </div>
// ) : (
//   !loading && (
//     <div className="text-gray-500 italic text-sm">No suitable activities found for the selected preferences and trip dates.</div>
//   )
// )}


//       {!loading && optimalActivities.length === 0 && activities.length > 0 && (
//         <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
//           <p>No valid itinerary found within the given constraints.</p>
//           <p className="text-sm mt-1">Try adjusting your preferences or budget.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ItineraryPlanner;

// //working and spreading out across days
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ItineraryPlanner = () => {
//   const [activities, setActivities] = useState([]);
//   const [preferences, setPreferences] = useState([]);
//   const [touristInfo, setTouristInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [touristId, setTouristId] = useState(10);
//   const [optimalActivities, setOptimalActivities] = useState([]);

//   // Helper functions
//   const timeToMinutes = (timeStr) => {
//     const [h, m] = timeStr.split(':').map(Number);
//     return h * 60 + m;
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
//       console.log(`❌ ${activity.name}: No valid date found`);
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
//           trip_start: currentTourist.trip_start,
//           trip_end: currentTourist.trip_end,
//           budget: currentTourist.budget,
//           preferred_start: currentTourist.preferred_start,
//           preferred_end: currentTourist.preferred_end,
//           preferred_dates: currentTourist.preferred_dates
//         };
        
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
//           venuesResponse.data.forEach(venue => {
//             if (venue.is_active) {
//               validPreferredDates.forEach(dateStr => {
//                 // Check if venue is open on this specific preferred day
//                 const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//                 const dateObj = new Date(dateStr);
//                 const dayName = dayNames[dateObj.getDay()];
                
//                 console.log(`Checking ${venue.name} for ${dateStr} (${dayName}):`, venue.days_open);
                
//                 if (venue.days_open && venue.days_open[dayName] === true) {
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
//                     days_open: venue.days_open
//                   });
                  
//                   console.log(`✓ Added ${venue.name} for preferred day ${dateStr}`);
//                 } else {
//                   console.log(`✗ ${venue.name} closed on ${dayName} (${dateStr})`);
//                 }
//               });
//             }
//           });
//         }
        
//         // Process events - Only include events that occur exactly on valid preferred dates
//         const processedEvents = eventsResponse.data
//           .map(event => {
//             const startDate = new Date(event.start_datetime);
//             const endDate = new Date(event.end_datetime);
//             const duration = Math.round((endDate - startDate) / (1000 * 60));
//             const eventDateStr = startDate.toISOString().split('T')[0];
            
//             return {
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
//               flyer_image_path: event.flyer_image_path
//             };
//           })
//           .filter(event => {
//             // STRICT: Only include events on valid preferred dates
//             const isOnValidPreferredDate = validPreferredDates.includes(event.date);
//             console.log(`Event ${event.name} on ${event.date}: On preferred date = ${isOnValidPreferredDate}`);
//             return isOnValidPreferredDate;
//           });

//         // Combine and filter activities
//         const allActivities = [...processedVenues, ...processedEvents];
        
//         console.log('Total venues processed:', processedVenues.length);
//         console.log('Total events processed:', processedEvents.length);
//         console.log('Activities by preferred day:');
//         validPreferredDates.forEach(day => {
//           const dayActivities = allActivities.filter(act => act.date === day);
//           console.log(`  ${day}: ${dayActivities.length} activities`);
//         });

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

//   // Memory-efficient activity selection (replaces combinations approach)
//   const selectOptimalActivities = (validActivities, budget, preferences) => {
//     console.log('Using memory-efficient selection algorithm...');
    
//     // If we have very few activities, just use all valid ones
//     if (validActivities.length <= 5) {
//       const totalCost = validActivities.reduce((sum, act) => sum + act.cost, 0);
//       if (totalCost <= budget) {
//         console.log('Using all activities - small set');
//         return validActivities;
//       }
//     }
    
//     // Score and sort activities by value
//     const scoredActivities = validActivities.map(activity => ({
//       ...activity,
//       score: calculatePreferenceScore(activity),
//       efficiency: calculatePreferenceScore(activity) / Math.max(activity.cost, 1)
//     }));
    
//     // Sort by efficiency (score per dollar)
//     scoredActivities.sort((a, b) => b.efficiency - a.efficiency);
    
//     // Greedy selection with conflict checking
//     const selected = [];
//     let totalCost = 0;
    
//     for (const activity of scoredActivities) {
//       // Check budget constraint
//       if (totalCost + activity.cost > budget) continue;
      
//       // Check time conflicts
//       const hasConflict = selected.some(existing => hasTimeConflict(existing, activity));
//       if (hasConflict) continue;
      
//       // Check daily activity limit (max 3 activities per day)
//       const sameDay = selected.filter(existing => existing.date === activity.date);
//       if (sameDay.length >= 3) continue;
      
//       // Add the activity
//       selected.push(activity);
//       totalCost += activity.cost;
      
//       // Stop if we have enough activities
//       if (selected.length >= 6) break;
//     }
    
//     console.log(`Selected ${selected.length} activities with total cost ${totalCost}`);
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

//   // Render UI
//   const totalCost = optimalActivities.reduce((sum, act) => sum + act.cost, 0);
//   const budget = touristInfo?.budget ? parseFloat(touristInfo.budget) : 300;

//   return (
//     <div className="p-6 max-w-5xl mx-auto bg-white">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold text-blue-800">Tourist Itinerary Planner</h1>
//         <div className="text-sm text-gray-600">
//           Preferred Days Planning
//         </div>
//       </div>

//       {loading && (
//         <div className="text-center py-8">
//           <div className="text-lg">Loading itinerary for tourist #{touristId}...</div>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           <p>Error: {error}</p>
//           <p className="text-sm mt-2">Showing with fallback data</p>
//         </div>
//       )}

//       {touristInfo && (
//         <div className="bg-blue-50 p-4 rounded-lg mb-6">
//           <h2 className="text-lg font-semibold mb-2">Tourist Information</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
//             <div>
//               <span className="font-medium">Trip:</span> {
//                 new Date(touristInfo.trip_start).toLocaleDateString('en-US', { 
//                   year: 'numeric', 
//                   month: 'short', 
//                   day: 'numeric' 
//                 })
//               } to {
//                 new Date(touristInfo.trip_end).toLocaleDateString('en-US', { 
//                   year: 'numeric', 
//                   month: 'short', 
//                   day: 'numeric' 
//                 })
//               }
//             </div>
//             <div><span className="font-medium">Budget:</span> ${budget}</div>
//             <div>
//               <span className="font-medium">Preferred Days:</span> {
//                 touristInfo.preferred_dates 
//                   ? touristInfo.preferred_dates.map(date => 
//                       new Date(date).toLocaleDateString('en-US', { 
//                         month: 'short', 
//                         day: 'numeric' 
//                       })
//                     ).join(', ')
//                   : 'None specified'
//               }
//             </div>            
//             <div><span className="font-medium">Preferred Hours:</span> {touristInfo.preferred_start?.substring(0, 5) || '09:00'} - {touristInfo.preferred_end?.substring(0, 5) || '18:00'}</div>
//           </div>
          
//           {/* Show which preferred days are valid for planning */}
//           <div className="mt-3 p-2 bg-blue-100 rounded text-sm">
//             <span className="font-medium">Valid Planning Days: </span>
//             {(() => {
//               const tripStart = new Date(touristInfo.trip_start);
//               const tripEnd = new Date(touristInfo.trip_end);
//               const validDays = touristInfo.preferred_dates.filter(dateStr => {
//                 const date = new Date(dateStr);
//                 return date >= tripStart && date <= tripEnd;
//               });
//               return validDays.length > 0 
//                 ? validDays.map(date => 
//                     new Date(date).toLocaleDateString('en-US', { 
//                       weekday: 'short',
//                       month: 'short', 
//                       day: 'numeric' 
//                     })
//                   ).join(', ')
//                 : 'None (no preferred days fall within trip period)';
//             })()}
//           </div>
//         </div>
//       )}

//       {!loading && optimalActivities.length > 0 && (
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold mb-4">Recommended Itinerary</h2>
          
//           {/* Show activities for each day */}
//           {optimalActivities.map((activity, index) => {
//             // Check if this is the first activity of a new day
//             const isNewDay = index === 0 || activity.date !== optimalActivities[index - 1].date;
            
//             return (
//               <div key={activity.id} className="mb-4">
//                 {isNewDay && (
//                   <h3 className="text-lg font-semibold mt-6 mb-3 flex items-center">
//                     <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
//                     {new Date(activity.date + 'T00:00:00').toLocaleDateString('en-US', { 
//                       weekday: 'long', 
//                       year: 'numeric', 
//                       month: 'long', 
//                       day: 'numeric' 
//                     })}
//                   </h3>
//                 )}
                
//                 <div className="ml-5 p-4 border-l-4 border-blue-300 bg-gray-50 rounded-r">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="font-medium text-lg">
//                       {activity.start_time}-{calculateEndTime(activity.start_time, activity.duration)}: {activity.name}
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <span className={`px-2 py-1 rounded text-xs ${
//                         activity.type === 'event' 
//                           ? 'bg-red-100 text-red-800' 
//                           : 'bg-blue-100 text-blue-800'
//                       }`}>
//                         {activity.type.toUpperCase()}
//                       </span>
//                       {activity.cost > 0 && (
//                         <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
//                           ${activity.cost}
//                         </span>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
//                     <div>
//                       <div><span className="font-medium">Duration:</span> {activity.duration} minutes</div>
//                       <div><span className="font-medium">Location:</span> {activity.address || activity.venue_location}</div>
//                       <div><span className="font-medium">Category:</span> {activity.tags.join(', ')}</div>
//                     </div>
//                     <div>
//                       {activity.description && (
//                         <div className="text-xs text-gray-500 italic">
//                           {activity.description}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//           {/* Summary */}
//           <div className="mt-6 p-4 bg-green-50 rounded-lg">
//             <h3 className="font-semibold text-lg mb-3">Itinerary Summary</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//               <div>
//                 <div className="font-medium">Total Activities</div>
//                 <div className="text-2xl font-bold text-green-600">{optimalActivities.length}</div>
//               </div>
//               <div>
//                 <div className="font-medium">Total Cost</div>
//                 <div className="text-2xl font-bold text-green-600">${totalCost.toFixed(2)}</div>
//               </div>
//               <div>
//                 <div className="font-medium">Budget Remaining</div>
//                 <div className="text-2xl font-bold text-blue-600">${(budget - totalCost).toFixed(2)}</div>
//               </div>
//               <div>
//                 <div className="font-medium">Days Planned</div>
//                 <div className="text-2xl font-bold text-purple-600">
//                   {new Set(optimalActivities.map(act => act.date)).size}
//                 </div>
//               </div>
//             </div>
            
//             <div className="mt-4 pt-4 border-t border-green-200">
//               <div className="text-sm">
//                 <span className="font-medium">Activity Mix: </span>
//                 {(() => {
//                   const events = optimalActivities.filter(act => act.type === 'event').length;
//                   const venues = optimalActivities.filter(act => act.type === 'venue').length;
//                   return `${events} events, ${venues} venues`;
//                 })()}
//               </div>
//               <div className="text-xs text-gray-500 mt-1">
//                 Planned only for preferred days within trip period
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {!loading && optimalActivities.length === 0 && activities.length > 0 && (
//         <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
//           <div className="font-medium">No optimal itinerary found</div>
//           <p className="text-sm mt-1">No activities found for your preferred days and time slots.</p>
//           <div className="text-sm mt-2">
//             <div>• Available activities: {activities.length}</div>
//             <div>• Budget: ${budget}</div>
//             <div>• Try adjusting your preferred days, times, or budget</div>
//           </div>
//         </div>
//       )}

//       {!loading && activities.length === 0 && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           <div className="font-medium">No activities available</div>
//           <p className="text-sm mt-1">No activities found for your preferred days within the trip period.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ItineraryPlanner;

// //working and activities spread across different days
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItineraryPlanner = () => {
  const [activities, setActivities] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [touristInfo, setTouristInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [touristId, setTouristId] = useState(10);
  const [optimalActivities, setOptimalActivities] = useState([]);

  // Helper functions
  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // Helper function to calculate end time
  const calculateEndTime = (startTime, duration) => {
    const [h, m] = startTime.split(':').map(Number);
    const startMinutes = h * 60 + m;
    const endMinutes = startMinutes + duration;
    const hours = Math.floor(endMinutes / 60);
    const minutes = endMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Ensures the activities don't clash
  const hasTimeConflict = (act1, act2) => {
    if (act1.date !== act2.date) return false;
    const s1 = timeToMinutes(act1.start_time);
    const e1 = s1 + act1.duration;
    const s2 = timeToMinutes(act2.start_time);
    const e2 = s2 + act2.duration;
    return !(e1 <= s2 || e2 <= s1);
  };

  // Ensuring the activities are within a certain time frame
  const fitsPreferredSlot = (activity) => {
    if (!touristInfo) return false;
    const actStart = timeToMinutes(activity.start_time);
    const actEnd = actStart + activity.duration;
    const prefStart = timeToMinutes(touristInfo.preferred_start?.substring(0, 5)) || timeToMinutes('09:00');
    const prefEnd = timeToMinutes(touristInfo.preferred_end?.substring(0, 5)) || timeToMinutes('18:00');
    const overlaps = (actStart <= prefEnd) && (actEnd >= prefStart);
    
    return overlaps;
  };

  const fitsPreferredDate = (activity) => {
    if (!touristInfo || !touristInfo.preferred_dates) return true;

    // Get valid preferred dates within trip period
    const tripStart = new Date(touristInfo.trip_start);
    const tripEnd = new Date(touristInfo.trip_end);
    const validPreferredDates = touristInfo.preferred_dates.filter(dateStr => {
      const date = new Date(dateStr);
      return date >= tripStart && date <= tripEnd;
    });

    // STRICT CHECK: Activity must be on a valid preferred date
    let activityDateStr;
    if (activity.date instanceof Date) {
      activityDateStr = activity.date.toISOString().split('T')[0];
    } else if (typeof activity.date === 'string') {
      activityDateStr = activity.date.split('T')[0];
    } else {
      console.log(`${activity.name}: No valid date found`);
      return false;
    }

    const isOnValidPreferredDate = validPreferredDates.includes(activityDateStr);
    console.log(`${activity.name} on ${activityDateStr}: Valid preferred date = ${isOnValidPreferredDate}`);
    console.log(`Valid preferred dates: [${validPreferredDates.join(', ')}]`);
    
    return isOnValidPreferredDate;
  };

  // Ensures the venues are open on certain days
  const isVenueOpenOnActivityDate = (activity) => {
    if (activity.type === 'event') return true;

    if (activity.type === 'venue') {
      const activityDate = new Date(activity.date);
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = dayNames[activityDate.getDay()];

      // days_open is already an object, no need to parse:
      const daysOpen = activity.days_open;

      return daysOpen[dayName] === true;
    }

    return false;
  };

  const normalizeTag = (text) => {
    let normalized = text.toLowerCase().trim();
    normalized = normalized.replace(/[()&\-/]/g, ' ');
    normalized = normalized.replace(/\s+/g, ' ');
    normalized = normalized.replace(/s\b/g, '');
    return normalized.trim();
  };

  const calculatePreferenceScore = (activity) => {
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
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch tourist info and preferences
        const touristResponse = await axios.get(`http://localhost:5001/api/prefer/tourists/${touristId}`);
        const allTourists = touristResponse.data;
        
        // Find the specific tourist by ID
        const currentTourist = allTourists.find(t => t.tourist_id === touristId);
        
        if (!currentTourist) {
          throw new Error(`Tourist with ID ${touristId} not found`);
        }
        
        const touristData = {
          tourist_id: currentTourist.tourist_id,
          trip_start: currentTourist.trip_start,
          trip_end: currentTourist.trip_end,
          budget: currentTourist.budget,
          preferred_start: currentTourist.preferred_start,
          preferred_end: currentTourist.preferred_end,
          preferred_dates: currentTourist.preferred_dates
        };
        console.log("TOURISTS DAYS",currentTourist.preferred_dates);
        setTouristInfo(touristData);

        // Process preferences
        const processedPrefs = currentTourist.preferences && currentTourist.preferences.length > 0
        ? currentTourist.preferences.map(pref => ({
            category: pref.tag,
            weight: pref.weight
          }))
        : [ //fallback preferences
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
        
        // Fetch venues and events
        const [venuesResponse, eventsResponse] = await Promise.all([
          axios.get('http://localhost:5001/api/venues'),
          axios.get('http://localhost:5001/api/events')
        ]);

        // Get valid preferred dates within trip period
        const tripStart = new Date(currentTourist.trip_start);
        const tripEnd = new Date(currentTourist.trip_end);
        const validPreferredDates = currentTourist.preferred_dates.filter(dateStr => {
          const date = new Date(dateStr);
          return date >= tripStart && date <= tripEnd;
        });

        console.log('Valid preferred dates for planning:', validPreferredDates);

        // Process venues - Create instances ONLY for valid preferred days they're open
        const processedVenues = [];
        if (validPreferredDates.length > 0) {
          venuesResponse.data.forEach(venue => {
            if (venue.is_active) {
              validPreferredDates.forEach(dateStr => {
                // Check if venue is open on this specific preferred day
                const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                const dateObj = new Date(dateStr);
                const dayName = dayNames[dateObj.getDay()];
                
                console.log(`Checking ${venue.name} for ${dateStr} (${dayName}):`, venue.days_open);
                
                if (venue.days_open && venue.days_open[dayName] === true) {
                  processedVenues.push({
                    id: `venue_${venue.venue_id}_${dateStr}`,
                    name: venue.name,
                    cost: parseFloat(venue.cost) || 0,
                    duration: 180,
                    date: dateStr, // This MUST be the exact preferred date
                    start_time: venue.opening_time?.substring(0, 5) || '09:00',
                    end_time: venue.closing_time?.substring(0, 5) || '17:00',
                    tags: [venue.venue_type],
                    priority: 2,
                    type: 'venue',
                    address: venue.address,
                    description: venue.description,
                    is_active: venue.is_active,
                    days_open: venue.days_open
                  });
                  
                  console.log(`✓ Added ${venue.name} for preferred day ${dateStr}`);
                } else {
                  console.log(`✗ ${venue.name} closed on ${dayName} (${dateStr})`);
                }
              });
            }
          });
        }
        
        // Process events - Only include events that occur exactly on valid preferred dates
        const processedEvents = eventsResponse.data
          .map(event => {
            const startDate = new Date(event.start_datetime);
            const endDate = new Date(event.end_datetime);
            const duration = Math.round((endDate - startDate) / (1000 * 60));
            const eventDateStr = startDate.toISOString().split('T')[0];
            
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
              flyer_image_path: event.flyer_image_path
            };
          })
          .filter(event => {
            // STRICT: Only include events on valid preferred dates
            const isOnValidPreferredDate = validPreferredDates.includes(event.date);
            console.log(`Event ${event.name} on ${event.date}: On preferred date = ${isOnValidPreferredDate}`);
            return isOnValidPreferredDate;
          });

        // Combine and filter activities
        //const allActivities = [...processedVenues, ...processedEvents];
        
        console.log('Total venues processed:', processedVenues.length);
        console.log('Total events processed:', processedEvents.length);
        console.log('Valid preferred dates used for processing:', validPreferredDates);
        console.log('Activities by preferred day:');
        validPreferredDates.forEach(day => {
          const dayActivities = [...processedVenues, ...processedEvents].filter(act => act.date === day);
          console.log(`  ${day}: ${dayActivities.length} activities`);
          dayActivities.forEach(act => {
            console.log(`    - ${act.name} (${act.type})`);
          });
        });

        // VALIDATION: Ensure all activities are on valid preferred dates
        const allActivities = [...processedVenues, ...processedEvents];
        const invalidActivities = allActivities.filter(act => !validPreferredDates.includes(act.date));
        
        if (invalidActivities.length > 0) {
          console.error('INVALID ACTIVITIES FOUND (not on preferred dates):');
          invalidActivities.forEach(act => {
            console.error(`  - ${act.name} on ${act.date} (should be one of: ${validPreferredDates.join(', ')})`);
          });
        } else {
          console.log('All activities are on valid preferred dates');
        }

        setActivities(allActivities);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        
        // Fallback data
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
   
  }, [touristId]);

  // Memory-efficient activity selection with venue diversity
  const selectOptimalActivities = (validActivities, budget, preferences) => {
    console.log('Using memory-efficient selection with venue diversity...');
    
    // Score and sort activities by value
    const scoredActivities = validActivities.map(activity => ({
      ...activity,
      score: calculatePreferenceScore(activity),
      efficiency: calculatePreferenceScore(activity) / Math.max(activity.cost, 1)
    }));
    
    // Sort by efficiency (score per dollar)
    scoredActivities.sort((a, b) => b.efficiency - a.efficiency);
    
    // Track used venue names to prevent duplicates
    const usedVenueNames = new Set();
    const selected = [];
    let totalCost = 0;
    
    for (const activity of scoredActivities) {
      // Check budget constraint
      if (totalCost + activity.cost > budget) continue;
      
      // Check time conflicts
      const hasConflict = selected.some(existing => hasTimeConflict(existing, activity));
      if (hasConflict) continue;
      
      // PREVENT VENUE DUPLICATES: Skip if we've already selected this venue
      if (activity.type === 'venue') {
        if (usedVenueNames.has(activity.name)) {
          console.log(` Skipping duplicate venue: ${activity.name}`);
          continue;
        }
      }
      
      // Check daily activity limit (max 3 activities per day)
      const sameDay = selected.filter(existing => existing.date === activity.date);
      if (sameDay.length >= 3) continue;
      
      // Add the activity
      selected.push(activity);
      totalCost += activity.cost;
      
      // Track venue name if it's a venue
      if (activity.type === 'venue') {
        usedVenueNames.add(activity.name);
        console.log(`✓ Added unique venue: ${activity.name} on ${activity.date}`);
      } else {
        console.log(`✓ Added event: ${activity.name} on ${activity.date}`);
      }
      
      // Stop if we have enough activities
      if (selected.length >= 6) break;
    }
    
    console.log(`Selected ${selected.length} unique activities with total cost ${totalCost}`);
    console.log('Selected venues:', Array.from(usedVenueNames));
    return selected;
  };

  // Generate optimal itinerary - Memory-safe version
  useEffect(() => {
    if (activities.length > 0 && preferences.length > 0 && touristInfo) {
      console.log('Generating itinerary for preferred days only...');
      console.log('Total activities available:', activities.length);

      // Filter activities that fit preferred time slots and dates
      const validActivities = activities.filter(act => {
        const fitsSlot = fitsPreferredSlot(act);
        const fitsDate = fitsPreferredDate(act);
        const isOpen = isVenueOpenOnActivityDate(act);
        
        console.log(`${act.name} on ${act.date}: slot=${fitsSlot}, date=${fitsDate}, open=${isOpen}`);
        
        return fitsSlot && fitsDate && isOpen;
      });

      console.log('Valid activities after filtering:', validActivities.length);

      if (validActivities.length === 0) {
        console.log('No valid activities found for preferred days and times');
        setOptimalActivities([]);
        return;
      }

      const budget = parseFloat(touristInfo.budget) || 1200;
      
      // Use memory-efficient selection instead of combinations
      const selectedActivities = selectOptimalActivities(validActivities, budget, preferences);
      
      // Sort by date and time
      const sortedActivities = selectedActivities.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.start_time.localeCompare(b.start_time);
      });
      
      console.log('Final optimal activities:', sortedActivities.length);
      sortedActivities.forEach(act => {
        console.log(`- ${act.name} on ${act.date} at ${act.start_time} (score: ${act.score}, cost: ${act.cost})`);
      });
      
      setOptimalActivities(sortedActivities);
    }
  }, [activities, preferences, touristInfo]);

  // Debug logging
  useEffect(() => {
    if (!loading) {
      console.log('Current state:', {
        touristInfo,
        preferences,
        activities: activities.length,
        optimalActivities: optimalActivities.length
      });
    }
  }, [loading, touristInfo, preferences, activities, optimalActivities]);

  // Render UI
  const totalCost = optimalActivities.reduce((sum, act) => sum + act.cost, 0);
  const budget = touristInfo?.budget ? parseFloat(touristInfo.budget) : 300;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-blue-800">Tourist Itinerary Planner</h1>
        <div className="text-sm text-gray-600">
          Preferred Days Planning
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="text-lg">Loading itinerary for tourist #{touristId}...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Showing with fallback data</p>
        </div>
      )}

      {touristInfo && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Tourist Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div>
              <span className="font-medium">Trip:</span> {
                new Date(touristInfo.trip_start).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
              } to {
                new Date(touristInfo.trip_end).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
              }
            </div>
            <div><span className="font-medium">Budget:</span> ${budget}</div>
            <div>
              <span className="font-medium">Preferred Days:</span> {
                touristInfo.preferred_dates 
                  ? touristInfo.preferred_dates.map(date => 
                      new Date(date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })
                    ).join(', ')
                  : 'None specified'
              }
            </div>            
            <div><span className="font-medium">Preferred Hours:</span> {touristInfo.preferred_start?.substring(0, 5) || '09:00'} - {touristInfo.preferred_end?.substring(0, 5) || '18:00'}</div>
          </div>
          
          {/* Show which preferred days are valid for planning */}
          <div className="mt-3 p-2 bg-blue-100 rounded text-sm">
            <span className="font-medium">Valid Planning Days: </span>
            {(() => {
              const tripStart = new Date(touristInfo.trip_start);
              const tripEnd = new Date(touristInfo.trip_end);
              const validDays = touristInfo.preferred_dates.filter(dateStr => {
                const date = new Date(dateStr);
                return date >= tripStart && date <= tripEnd;
              });
              return validDays.length > 0 
                ? validDays.map(date => 
                    new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric' 
                    })
                  ).join(', ')
                : 'None (no preferred days fall within trip period)';
            })()}
          </div>
        </div>
      )}

      {!loading && optimalActivities.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Recommended Itinerary</h2>
          
          {/* Show activities for each day */}
          {optimalActivities.map((activity, index) => {
            // Check if this is the first activity of a new day
            const isNewDay = index === 0 || activity.date !== optimalActivities[index - 1].date;
            
            return (
              <div key={activity.id} className="mb-4">
                {isNewDay && (
                  <h3 className="text-lg font-semibold mt-6 mb-3 flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    {new Date(activity.date ).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                )}
                
                <div className="ml-5 p-4 border-l-4 border-blue-300 bg-gray-50 rounded-r">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-lg">
                      {activity.start_time}-{calculateEndTime(activity.start_time, activity.duration)}: {activity.name}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        activity.type === 'event' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.type.toUpperCase()}
                      </span>
                      {activity.cost > 0 && (
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                          ${activity.cost}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <div><span className="font-medium">Duration:</span> {activity.duration} minutes</div>
                      <div><span className="font-medium">Location:</span> {activity.address || activity.venue_location}</div>
                      <div><span className="font-medium">Category:</span> {activity.tags.join(', ')}</div>
                    </div>
                    <div>
                      {activity.description && (
                        <div className="text-xs text-gray-500 italic">
                          {activity.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Summary */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Itinerary Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium">Total Activities</div>
                <div className="text-2xl font-bold text-green-600">{optimalActivities.length}</div>
              </div>
              <div>
                <div className="font-medium">Total Cost</div>
                <div className="text-2xl font-bold text-green-600">${totalCost.toFixed(2)}</div>
              </div>
              <div>
                <div className="font-medium">Budget Remaining</div>
                <div className="text-2xl font-bold text-blue-600">${(budget - totalCost).toFixed(2)}</div>
              </div>
              <div>
                <div className="font-medium">Days Planned</div>
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(optimalActivities.map(act => act.date)).size}
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="text-sm">
                <span className="font-medium">Activity Mix: </span>
                {(() => {
                  const events = optimalActivities.filter(act => act.type === 'event').length;
                  const venues = optimalActivities.filter(act => act.type === 'venue').length;
                  return `${events} events, ${venues} venues`;
                })()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Planned only for preferred days within trip period
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && optimalActivities.length === 0 && activities.length > 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <div className="font-medium">No optimal itinerary found</div>
          <p className="text-sm mt-1">No activities found for your preferred days and time slots.</p>
          <div className="text-sm mt-2">
            <div>• Available activities: {activities.length}</div>
            <div>• Budget: ${budget}</div>
            <div>• Try adjusting your preferred days, times, or budget</div>
          </div>
        </div>
      )}

      {!loading && activities.length === 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="font-medium">No activities available</div>
          <p className="text-sm mt-1">No activities found for your preferred days within the trip period.</p>
        </div>
      )}
    </div>
  );
};

export default ItineraryPlanner;