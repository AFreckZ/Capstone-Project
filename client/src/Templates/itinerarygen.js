// // React version of the Python itinerary generator

// import React, { useEffect, useState } from 'react';

// const activities = [
//   {
//     name: 'Fort Rocky Tours',
//     cost: 90,
//     duration: 120,
//     date: '2025-04-03',
//     start_time: '10:00',
//     end_time: '16:00',
//     tags: ['tour (historical)'],
//     priority: 2,
//     type: 'venue',
//   },
//   {
//     name: 'UWI Carnival',
//     cost: 50,
//     duration: 120,
//     date: '2025-04-03',
//     start_time: '12:00',
//     end_time: '17:00',
//     tags: ['outdoor activity', 'party'],
//     priority: 1,
//     type: 'event',
//   },
//   {
//     name: 'Jamaica Food and Beverage',
//     cost: 70,
//     duration: 270,
//     date: '2025-04-06',
//     start_time: '14:00',
//     end_time: '19:00',
//     tags: ['outdoor food and dining', 'outdoor festival'],
//     priority: 1,
//     type: 'event',
//   },
//   {
//     name: 'Devon House',
//     cost: 30,
//     duration: 180,
//     date: '2025-04-06',
//     start_time: '10:00',
//     end_time: '22:00',
//     tags: ['tour (historical)', 'outdoor activity', 'outdoor food and dining'],
//     priority: 2,
//     type: 'venue',
//   },
// ];

// const preferences = [
//   { name: 'Outdoor festival', weight: 10 },
//   { name: 'Tours (historical)', weight: 9 },
//   { name: 'Outdoor Food and Dining', weight: 8 },
//   { name: 'Outdoor Activity', weight: 7 },
//   { name: 'Indoor Activity', weight: 6 },
//   { name: 'Indoor Festival', weight: 5 },
//   { name: 'Indoor Food and Dining', weight: 4 },
//   { name: 'Beach', weight: 3 },
//   { name: 'Tours (Nature)', weight: 2 },
//   { name: 'Live Music/concert', weight: 1 },
// ];

// const preferredSlots = [
//   { date: '2025-04-03', start: '10:00', end: '16:00' },
//   { date: '2025-04-04', start: '14:00', end: '18:00' },
//   { date: '2025-04-06', start: '10:00', end: '19:00' },
// ];

// const budget = 300;

// function timeToMinutes(timeStr) {
//   const [h, m] = timeStr.split(':').map(Number);
//   return h * 60 + m;
// }

// function hasTimeConflict(act1, act2) {
//   if (act1.date !== act2.date) return false;
//   const s1 = timeToMinutes(act1.start_time);
//   const e1 = s1 + act1.duration;
//   const s2 = timeToMinutes(act2.start_time);
//   const e2 = s2 + act2.duration;
//   return !(e1 <= s2 || e2 <= s1);
// }

// function fitsPreferredSlot(activity) {
//   return preferredSlots.some((slot) => {
//     if (activity.date !== slot.date) return false;
//     const actStart = timeToMinutes(activity.start_time);
//     const actEnd = actStart + activity.duration;
//     const slotStart = timeToMinutes(slot.start);
//     const slotEnd = timeToMinutes(slot.end);
//     return actStart >= slotStart && actEnd <= slotEnd;
//   });
// }

// function normalizeTag(text) {
//   return text.toLowerCase().replace(/[()\-]/g, '').replace(/s\b/, '').trim();
// }

// function calculatePreferenceScore(activity) {
//   const normTags = activity.tags.map(normalizeTag);
//   let score = 0;
//   for (const pref of preferences) {
//     const prefNorm = normalizeTag(pref.name);
//     if (normTags.includes(prefNorm)) {
//       score += pref.weight * 2;
//     }
//   }
//   return score;
// }

// function generateOptimalItinerary() {
//   const valid = activities.filter(fitsPreferredSlot);
//   let best = [], bestScore = 0;
//   for (let r = 1; r <= valid.length; r++) {
//     const combos = combinations(valid, r);
//     for (const combo of combos) {
//       const cost = combo.reduce((sum, a) => sum + a.cost, 0);
//       if (cost > budget) continue;
//       const conflict = combo.some((a, i) =>
//         combo.some((b, j) => j > i && hasTimeConflict(a, b))
//       );
//       if (conflict) continue;
//       let score = combo.reduce((sum, a) => sum + calculatePreferenceScore(a), 0);
//       score += cost * 0.3;
//       if (score > bestScore || (score === bestScore && combo.length > best.length)) {
//         best = combo;
//         bestScore = score;
//       }
//     }
//   }
//   return best.sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time));
// }

// function combinations(arr, k) {
//   if (k === 0) return [[]];
//   if (arr.length < k) return [];
//   const [first, ...rest] = arr;
//   const withFirst = combinations(rest, k - 1).map((combo) => [first, ...combo]);
//   const withoutFirst = combinations(rest, k);
//   return [...withFirst, ...withoutFirst];
// }

// export default function ItineraryPlanner() {
//   const [itinerary, setItinerary] = useState([]);

//   useEffect(() => {
//     const result = generateOptimalItinerary();
//     setItinerary(result);
//   }, []);

//   const totalCost = itinerary.reduce((sum, a) => sum + a.cost, 0);
//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Weighted Preference Itinerary</h1>
//       <p>Budget: ${budget}</p>
//       {itinerary.length === 0 ? (
//         <p>No valid itinerary found within constraints.</p>
//       ) : (
//         <div>
//           {Array.from(new Set(itinerary.map((a) => a.date))).map((date) => (
//             <div key={date} className="mt-4">
//               <h2 className="text-xl font-semibold">
//                 {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
//               </h2>
//               {itinerary
//                 .filter((a) => a.date === date)
//                 .map((a, i) => (
//                   <div key={i} className="ml-4">
//                     <p>{a.start_time}-{a.end_time}: {a.name}</p>
//                     <ul className="ml-6 list-disc">
//                       <li>Cost: ${a.cost}</li>
//                       <li>Duration: {a.duration} mins</li>
//                       <li>Type: {a.type}</li>
//                       <li>Tags: {a.tags.join(', ')}</li>
//                     </ul>
//                   </div>
//                 ))}
//             </div>
//           ))}
//           <p className="mt-4 font-semibold">Total Cost: ${totalCost}/{budget}</p>
//           <p>Budget Remaining: ${budget - totalCost}</p>
//         </div>
//       )}
//     </div>
//   );
// }
// React version of the Python itinerary generator
//import React, { useState, useEffect } from 'react';

// const ItineraryPlanner = () => {
//   const [activities, setActivities] = useState([]);
//   const [preferences, setPreferences] = useState([]);
//   const [touristInfo, setTouristInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   //const [tourist_id, setTouristId] = useState(1);
//   const [tourist_id,setTouristId]= useState(10);

//   const [optimalActivities, setOptimalActivities] = useState([]);
//   const [knapsackScore, setKnapsackScore] = useState(0);

//   // Fetch tourist information from database 
//   const fetchTouristInfo = async (tourist_id) => {
//     try {
//       const response = await fetch(`/api/tourists/${tourist_id}`);
//       if (!response.ok) throw new Error('Failed to fetch tourist information');
//       const data = await response.json();
//       return data;
//     } catch (err) {
//       console.error('Error fetching tourist info:', err);
//       // Fallback default tourist info
//       return {
//         tourist_id: null,
//         user_id: tourist_id,
//         trip_start: new Date().toISOString().split('T')[0],
//         trip_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//         budget: 300.00,
//         need_for_transport: 0,
//         preferred_start: "09:00:00",
//         preferred_end: "18:00:00",
//         address: null,
//         preferred_dates: [new Date().toISOString().split('T')[0]]
//       };
//     }
//   };

//   // Fetch user preferences 
//   const fetchUserPreferences = async (tourist_id) => {
//     try {
//       const response = await fetch(`/api/prefer/${tourist_id}`);
//       if (!response.ok) throw new Error('Failed to fetch user preferences');
      
//       const data = await response.json();
//       return data.preferences || [];
//     } catch (err) {
//       console.error('Error fetching preferences:', err);
//       // Fallback to default preferences
//       return [
//         { category: "Festival", weight: 10 },
//         { category: "Museum/Historical Site", weight: 9 },
//         { category: "Food & Dining (Local)", weight: 8 },
//         { category: "Food & Dining (Unique)", weight: 8 },
//         { category: "Outdoor Adventure", weight: 7 },
//         { category: "Indoor Adventure", weight: 6 },
//         { category: "Live Music", weight: 5 },
//         { category: "Beach/River", weight: 4 },
//         { category: "Club/Bar/Party", weight: 3 },
//         { category: "Party", weight: 3 },
//         { category: "Concert", weight: 2 },
//         { category: "Sport", weight: 1 },
//         { category: "Art/Talent Showcasing", weight: 1 }
//       ];
//     }
//   };

//   // Generate time slots based on tourist info
//   const generateTimeSlots = (touristInfo) => {
//     if (!touristInfo) return [];
    
//     const slots = [];
//     const startDate = new Date(touristInfo.trip_start);
//     const endDate = new Date(touristInfo.trip_end);
    
//     // Use preferred_dates if available, otherwise generate for trip duration
//     const datesToUse = touristInfo.preferred_dates && touristInfo.preferred_dates.length > 0 
//       ? touristInfo.preferred_dates 
//       : [];
    
//     if (datesToUse.length === 0) {
//       // Generate dates for entire trip duration
//       for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
//         datesToUse.push(d.toISOString().split('T')[0]);
//       }
//     }
    
//     // Create time slots for each date
//     datesToUse.forEach(date => {
//       slots.push({
//         date: date,
//         start_time: touristInfo.preferred_start ? touristInfo.preferred_start.slice(0, 5) : '09:00',
//         end_time: touristInfo.preferred_end ? touristInfo.preferred_end.slice(0, 5) : '18:00'
//       });
//     });
    
//     return slots;
//   };

//   // Fetch venues from database
//   const fetchVenues = async () => {
//     const response = await fetch('/api/venues');
//     if (!response.ok) throw new Error('Failed to fetch venues');
    
//     const venuesData = await response.json();
    
//     return venuesData
//       .filter(venue => venue.is_active)
//       .map(venue => ({
//         id: `venue_${venue.venue_id}`,
//         name: venue.name,
//         cost: parseFloat(venue.cost) || 0,
//         duration: venue.typical_duration_minutes || 180,
//         date: venue.available_date || new Date().toISOString().split('T')[0],
//         start_time: venue.opening_time || '09:00',
//         end_time: venue.closing_time || '17:00',
//         tags: venue.categories ? JSON.parse(venue.categories) : [venue.venue_type],
//         priority: venue.priority || 2,
//         type: 'venue',
//         address: venue.address,
//         description: venue.description,
//         rating: venue.rating || 0,
//         image_url: venue.image_url
//       }));
//   };

//   // Fetch events from database
//   const fetchEvents = async () => {
//     const response = await fetch('/api/events');
//     if (!response.ok) throw new Error('Failed to fetch events');
    
//     const eventsData = await response.json();
    
//     return eventsData.map(event => {
//       const startDate = new Date(event.start_datetime);
//       const endDate = new Date(event.end_datetime);
//       const duration = Math.round((endDate - startDate) / (1000 * 60));
      
//       return {
//         id: `event_${event.event_id}`,
//         name: event.name,
//         cost: parseFloat(event.cost) || 0,
//         duration: duration,
//         date: startDate.toISOString().split('T')[0],
//         start_time: startDate.toTimeString().slice(0, 5),
//         end_time: endDate.toTimeString().slice(0, 5),
//         tags: event.categories ? JSON.parse(event.categories) : [event.event_type],
//         priority: event.priority || 1,
//         type: 'event',
//         venue_location: event.venue_location,
//         description: event.description,
//         flyer_image_path: event.flyer_image_path,
//         organizer: event.organizer
//       };
//     });
//   };

//   // Main data fetching function
//   const fetchData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch tourist info first as other data depends on it
//       const touristData = await fetchTouristInfo(tourist_id);
//       setTouristInfo(touristData);
      
//       // Fetch remaining data in parallel
//       const [
//         userPreferences,
//         venueActivities,
//         eventActivities
//       ] = await Promise.all([
//         fetchUserPreferences(tourist_id),
//         fetchVenues(),
//         fetchEvents()
//       ]);
      
//       // Filter activities based on trip dates
//       const tripStart = new Date(touristData.trip_start);
//       const tripEnd = new Date(touristData.trip_end);
      
//       const filteredVenues = venueActivities.filter(venue => {
//         const venueDate = new Date(venue.date);
//         return venueDate >= tripStart && venueDate <= tripEnd;
//       });
      
//       const filteredEvents = eventActivities.filter(event => {
//         const eventDate = new Date(event.date);
//         return eventDate >= tripStart && eventDate <= tripEnd;
//       });
      
//       const allActivities = [...filteredVenues, ...filteredEvents];
      
//       setActivities(allActivities);
//       setPreferences(userPreferences);
      
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const timeToMinutes = (timeStr) => {
//     const [h, m] = timeStr.split(':').map(Number);
//     return h * 60 + m;
//   };

//   const hasTimeConflict = (act1, act2) => {
//     if (act1.date !== act2.date) return false;
//     const s1 = timeToMinutes(act1.start_time);
//     const e1 = s1 + act1.duration;
//     const s2 = timeToMinutes(act2.start_time);
//     const e2 = s2 + act2.duration;
//     return !(e1 <= s2 || e2 <= s1);
//   };

//   const fitsPreferredSlot = (activity) => {
//     if (!touristInfo) return false;
    
//     const timeSlots = generateTimeSlots(touristInfo);
    
//     for (const slot of timeSlots) {
//       if (activity.date === slot.date) {
//         const actStart = timeToMinutes(activity.start_time);
//         const actEnd = actStart + activity.duration;
//         const slotStart = timeToMinutes(slot.start_time);
//         const slotEnd = timeToMinutes(slot.end_time);
//         if (actStart >= slotStart && actEnd <= slotEnd) {
//           return true;
//         }
//       }
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
    
//     score += (activity.priority || 0) * 5;
//     score += (activity.rating || 0) * 3;
    
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

//   const generateOptimalItinerary = () => {
//     if (!touristInfo) return [];
    
//     const validActivities = activities.filter(fitsPreferredSlot);
//     let bestCombo = [];
//     let bestScore = 0;
    
//     for (let r = 1; r <= Math.min(validActivities.length, 10); r++) {
//       const combos = combinations(validActivities, r);
//       for (const combo of combos) {
//         const cost = combo.reduce((sum, a) => sum + a.cost, 0);
//         if (cost > touristInfo.budget) continue;
        
//         const conflict = combo.some((act1, i) => 
//           combo.slice(i + 1).some(act2 => hasTimeConflict(act1, act2))
//         );
//         if (conflict) continue;
        
//         const preferenceScore = combo.reduce((sum, a) => sum + calculatePreferenceScore(a), 0);
//         const costEfficiencyScore = cost > 0 ? preferenceScore / cost : preferenceScore;
//         const totalScore = preferenceScore + costEfficiencyScore * 0.1;
        
//         if (totalScore > bestScore || (totalScore === bestScore && combo.length > bestCombo.length)) {
//           bestCombo = combo;
//           bestScore = totalScore;
//         }
//       }
//     }
    
//     return bestCombo.sort((a, b) => {
//       if (a.date !== b.date) return a.date.localeCompare(b.date);
//       return a.start_time.localeCompare(b.start_time);
//     });
//   };

//   const weightedKnapsack = (activities, budget) => {
//     const n = activities.length;
//     const dp = Array(n + 1).fill(null).map(() => Array(budget + 1).fill(0));
    
//     for (let i = 1; i <= n; i++) {
//       const cost = Math.round(activities[i - 1].cost);
//       const value = calculatePreferenceScore(activities[i - 1]);
//       for (let w = 0; w <= budget; w++) {
//         if (cost <= w) {
//           dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - cost] + value);
//         } else {
//           dp[i][w] = dp[i - 1][w];
//         }
//       }
//     }
//     return dp[n][budget];
//   };

//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('en-US', { 
//       weekday: 'long', 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//   };

//   const getDaysDifference = (start, end) => {
//     const startDate = new Date(start);
//     const endDate = new Date(end);
//     const diffTime = Math.abs(endDate - startDate);
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//   };

//   useEffect(() => {
//     fetchData();
//   }, [tourist_id]);

//   useEffect(() => {
//     if (activities.length > 0 && preferences.length > 0 && touristInfo) {
//       const optimal = generateOptimalItinerary();
//       setOptimalActivities(optimal);
//       setKnapsackScore(weightedKnapsack(activities, Math.round(touristInfo.budget)));
//     }
//   }, [activities, preferences, touristInfo]);

//   const totalCost = optimalActivities.reduce((sum, act) => sum + act.cost, 0);

//   return (
//     <div className="p-6 max-w-5xl mx-auto bg-white">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold text-blue-800">=== TOURIST ITINERARY PLANNER ===</h1>
//         <div className="flex items-center gap-2">
//           <label htmlFor="tourist_id" className="text-sm font-medium">User ID:</label>
//           <input
//             id="tourist_id"
//             type="number"
//             value={tourist_id}
//             onChange={(e) => setTouristId(parseInt(e.target.value))}
//             className="border rounded px-2 py-1 w-20 text-sm"
//             min="1"
//           />
//         </div>
//       </div>

//       {/* Tourist Info Summary */}
//       {touristInfo && (
//         <div className="bg-blue-50 p-4 rounded-lg mb-6">
//           <h2 className="text-lg font-semibold mb-3 text-blue-800">🧳 Trip Information</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//             <div>
//               <span className="font-medium">📅 Trip Duration:</span>
//               <div>{formatDate(touristInfo.trip_start)} to {formatDate(touristInfo.trip_end)}</div>
//               <div className="text-xs text-gray-600">({getDaysDifference(touristInfo.trip_start, touristInfo.trip_end)} days)</div>
//             </div>
//             <div>
//               <span className="font-medium">💰 Budget:</span>
//               <div className="text-lg font-bold text-green-600">${touristInfo.budget}</div>
//             </div>
//             <div>
//               <span className="font-medium">🕐 Preferred Hours:</span>
//               <div>{touristInfo.preferred_start?.slice(0, 5)} - {touristInfo.preferred_end?.slice(0, 5)}</div>
//             </div>
//             <div>
//               <span className="font-medium">🚗 Transport Needed:</span>
//               <div>{touristInfo.need_for_transport ? 'Yes' : 'No'}</div>
//             </div>
//             {touristInfo.address && (
//               <div className="md:col-span-2">
//                 <span className="font-medium">📍 Address:</span>
//                 <div>{touristInfo.address}</div>
//               </div>
//             )}
//             {touristInfo.preferred_dates && touristInfo.preferred_dates.length > 0 && (
//               <div className="md:col-span-2">
//                 <span className="font-medium">📋 Preferred Dates:</span>
//                 <div className="text-xs">{touristInfo.preferred_dates.join(', ')}</div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {loading && (
//         <div className="text-center py-8">
//           <div className="text-lg">Loading tourist itinerary...</div>
//           <div className="text-sm text-gray-500 mt-2">Fetching tourist info, preferences, venues, and events...</div>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           <h3 className="font-bold">Database Error:</h3>
//           <p>{error}</p>
//           <div className="mt-2 text-sm">
//             <p>Expected API endpoints:</p>
//             <ul className="list-disc ml-4">
//               <li>/api/tourists/user/{tourist_id} - Tourist info from tourists table</li>
//               <li>/api/users/{tourist_id}/preferences - User preferences</li>
//               <li>/api/venues - Available venues</li>
//               <li>/api/events - Available events</li>
//             </ul>
//           </div>
//         </div>
//       )}

//       {!loading && !error && activities.length === 0 && (
//         <div className="text-center py-8 bg-yellow-50 rounded">
//           <p className="text-lg">No venues or events found for your trip dates.</p>
//           <p className="text-sm text-gray-500 mt-2">
//             Trip: {touristInfo?.trip_start} to {touristInfo?.trip_end}
//           </p>
//         </div>
//       )}

//       {!loading && !error && optimalActivities.length === 0 && activities.length > 0 && (
//         <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
//           <p className="font-semibold">No valid itinerary found within your constraints.</p>
//           <div className="text-sm mt-2">
//             <p>Budget: ${touristInfo?.budget}</p>
//             <p>Available activities in date range: {activities.length}</p>
//             <p>Try adjusting your preferred times or increasing your budget.</p>
//           </div>
//         </div>
//       )}

//       {!loading && !error && optimalActivities.length > 0 && (
//         <>
//           <div className="mb-6 bg-gray-50 p-4 rounded-lg">
//             <h2 className="text-xl font-semibold mb-3 text-gray-800">🗓️ Your Personalized Itinerary</h2>
//             {optimalActivities.reduce((acc, act) => {
//               const lastDate = acc.length > 0 ? acc[acc.length - 1].date : null;
//               if (act.date !== lastDate) {
//                 acc.push({ type: 'date', date: act.date });
//               }
//               acc.push({ type: 'activity', ...act });
//               return acc;
//             }, []).map((item, index) => (
//               <div key={index}>
//                 {item.type === 'date' && (
//                   <h3 className="text-lg font-semibold mt-4 mb-2 text-blue-600 border-b border-blue-200 pb-1">
//                     📅 {formatDate(item.date)}
//                   </h3>
//                 )}
//                 {item.type === 'activity' && (
//                   <div className="ml-4 mb-3 p-4 border-l-4 border-blue-300 bg-white rounded-r shadow-sm">
//                     <div className="font-medium text-lg text-gray-800">
//                       🕐 {item.start_time} - {item.end_time}: <span className="text-blue-700">{item.name}</span>
//                     </div>
//                     <div className="text-sm text-gray-600 ml-4 mt-2 grid grid-cols-2 gap-2">
//                       <div>💰 Cost: <span className="font-semibold">${item.cost}</span></div>
//                       <div>⏱️ Duration: {item.duration} min</div>
//                       <div>🏷️ Type: {item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
//                       <div>📋 Categories: {item.tags.join(', ')}</div>
//                       {item.rating && <div>⭐ Rating: {item.rating}/5</div>}
//                       {touristInfo?.need_for_transport && (
//                         <div className="col-span-2 text-orange-600">🚗 Transport may be needed</div>
//                       )}
//                       {item.address && <div className="col-span-2">📍 {item.address}</div>}
//                       {item.venue_location && <div className="col-span-2">📍 {item.venue_location}</div>}
//                       {item.description && <div className="col-span-2 mt-1 text-xs italic">{item.description}</div>}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <div className="bg-green-50 p-4 rounded-lg">
//               <h3 className="font-semibold mb-2 text-green-800">💰 Budget Analysis</h3>
//               <div className="text-sm space-y-1">
//                 <div>Total Cost: <span className="font-bold">${totalCost.toFixed(2)}</span></div>
//                 <div>Budget: <span className="font-bold">${touristInfo?.budget}</span></div>
//                 <div>Remaining: <span className="font-bold text-green-600">${(touristInfo?.budget - totalCost).toFixed(2)}</span></div>
//                 <div>Usage: <span className="font-bold">{((totalCost/touristInfo?.budget)*100).toFixed(1)}%</span></div>
//               </div>
//             </div>

//             <div className="bg-blue-50 p-4 rounded-lg">
//               <h3 className="font-semibold mb-2 text-blue-800">📊 Trip Stats</h3>
//               <div className="text-sm space-y-1">
//                 <div>Activities: <span className="font-bold">{optimalActivities.length}</span></div>
//                 <div>Score: <span className="font-bold">{knapsackScore}</span></div>
//                 <div>Venues: <span className="font-bold">{optimalActivities.filter(a => a.type === 'venue').length}</span></div>
//                 <div>Events: <span className="font-bold">{optimalActivities.filter(a => a.type === 'event').length}</span></div>
//               </div>
//             </div>

//             <div className="bg-purple-50 p-4 rounded-lg">
//               <h3 className="font-semibold mb-2 text-purple-800">🎯 Preferences</h3>
//               <div className="text-xs space-y-1">
//                 {preferences.slice(0, 4).map((pref) => {
//                   const prefNorm = normalizeTag(pref.category);
//                   const covered = optimalActivities.some(act =>
//                     act.tags.some(tag => {
//                       const tagNorm = normalizeTag(tag);
//                       return prefNorm === tagNorm || tagNorm.includes(prefNorm) || prefNorm.includes(tagNorm);
//                     })
//                   );
//                   return (
//                     <div key={pref.category} className={`flex items-center ${covered ? 'text-green-700' : 'text-red-600'}`}>
//                       <span className="mr-1">{covered ? '✅' : '❌'}</span>
//                       <span>{pref.category} ({pref.weight})</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="font-semibold mb-2 text-gray-800">📈 Database & Processing Info</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//               <div>
//                 <div className="font-medium">Total Available:</div>
//                 <div>{activities.length} activities</div>
//               </div>
//               <div>
//                 <div className="font-medium">Venues:</div>
//                 <div>{activities.filter(a => a.type === 'venue').length}</div>
//               </div>
//               <div>
//                 <div className="font-medium">Events:</div>
//                 <div>{activities.filter(a => a.type === 'event').length}</div>
//               </div>
//               <div>
//                 <div className="font-medium">Preferences:</div>
//                 <div>{preferences.length} categories</div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ItineraryPlanner;
import React, { useState, useEffect } from 'react';

const ItineraryPlanner = () => {
  // State management
  const [activities, setActivities] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [touristInfo, setTouristInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [touristId, setTouristId] = useState(10);
  const [optimalActivities, setOptimalActivities] = useState([]);
  const [knapsackScore, setKnapsackScore] = useState(0);

  // Database fetch functions
  const fetchFromDatabase = async (endpoint, isJson = false) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      return isJson ? await response.json() : await response.text();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  };

  // Data parsers
  const parseTouristData = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return {
      tourist_id: touristId,
      trip_start: doc.getElementById('trip-start')?.value || new Date().toISOString().split('T')[0],
      trip_end: doc.getElementById('trip-end')?.value || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: parseFloat(doc.getElementById('budget')?.value) || 300,
      need_for_transport: doc.getElementById('transport')?.checked ? 1 : 0,
      preferred_start: doc.getElementById('pref-start')?.value || '09:00',
      preferred_end: doc.getElementById('pref-end')?.value || '18:00',
      address: doc.getElementById('address')?.textContent || null
    };
  };

  const parseActivityData = (html, type) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const items = Array.from(doc.querySelectorAll('.activity-item'));
    
    return items.map(item => {
      const baseData = {
        id: `${type}_${item.dataset.id}`,
        name: item.querySelector('.name')?.textContent || `Unknown ${type}`,
        cost: parseFloat(item.querySelector('.cost')?.textContent) || 0,
        duration: parseInt(item.querySelector('.duration')?.textContent) || 120,
        date: item.querySelector('.date')?.textContent || new Date().toISOString().split('T')[0],
        tags: item.querySelector('.tags')?.textContent.split(',') || [type],
        type: type,
        description: item.querySelector('.description')?.textContent || ''
      };

      if (type === 'venue') {
        return {
          ...baseData,
          start_time: item.querySelector('.opening-time')?.textContent || '09:00',
          end_time: item.querySelector('.closing-time')?.textContent || '17:00',
          address: item.querySelector('.address')?.textContent || '',
          rating: parseFloat(item.querySelector('.rating')?.textContent) || 0
        };
      } else { // event
        const startDate = new Date(item.querySelector('.start-datetime')?.textContent || new Date());
        const endDate = new Date(item.querySelector('.end-datetime')?.textContent || new Date(Date.now() + 2 * 60 * 60 * 1000));
        return {
          ...baseData,
          start_time: startDate.toTimeString().slice(0, 5),
          end_time: endDate.toTimeString().slice(0, 5),
          venue_location: item.querySelector('.location')?.textContent || ''
        };
      }
    });
  };

  // Data fetching
  const fetchTouristInfo = async () => {
    try {
      const [html, preferredDates] = await Promise.all([
        fetchFromDatabase(`/api/tourists/${touristId}`),
        fetchFromDatabase(`/api/tourists/${touristId}/preferences/dates`, true)
      ]);
      
      const data = parseTouristData(html);
      data.preferred_dates = preferredDates?.dates || [data.trip_start];
      return data;
    } catch (error) {
      console.error('Using fallback tourist data due to error:', error);
      return getDefaultTouristInfo();
    }
  };

  const getDefaultTouristInfo = () => ({
    tourist_id: touristId,
    trip_start: new Date().toISOString().split('T')[0],
    trip_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    budget: 300,
    need_for_transport: 0,
    preferred_start: '09:00',
    preferred_end: '18:00',
    address: null,
    preferred_dates: [new Date().toISOString().split('T')[0]]
  });

  const fetchActivities = async () => {
    try {
      const [venuesHtml, eventsHtml] = await Promise.all([
        fetchFromDatabase('/api/venues'),
        fetchFromDatabase('/api/events')
      ]);
      
      return [
        ...parseActivityData(venuesHtml, 'venue'),
        ...parseActivityData(eventsHtml, 'event')
      ];
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  };

  // Itinerary generation utilities
  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const hasTimeConflict = (act1, act2) => {
    if (act1.date !== act2.date) return false;
    const s1 = timeToMinutes(act1.start_time);
    const e1 = s1 + act1.duration;
    const s2 = timeToMinutes(act2.start_time);
    const e2 = s2 + act2.duration;
    return !(e1 <= s2 || e2 <= s1);
  };

  const calculatePreferenceScore = (activity) => {
    const categoryWeights = {
      'Festival': 10,
      'Museum/Historical Site': 9,
      'Food & Dining': 8,
      'Outdoor Adventure': 7,
      'Indoor Adventure': 6,
      'Live Music': 5,
      'Beach/River': 4,
      'Nightlife': 3,
      'Concert': 2,
      'Sport': 1
    };
    
    return activity.tags.reduce((score, tag) => {
      const matchedCategory = Object.keys(categoryWeights).find(cat => 
        tag.toLowerCase().includes(cat.toLowerCase()));
      return score + (matchedCategory ? categoryWeights[matchedCategory] : 1);
    }, 0);
  };

  const generateOptimalItinerary = () => {
    if (!touristInfo || activities.length === 0) return [];
    
    const validActivities = activities.filter(act => {
      const activityDate = new Date(act.date);
      const tripStart = new Date(touristInfo.trip_start);
      const tripEnd = new Date(touristInfo.trip_end);
      return activityDate >= tripStart && activityDate <= tripEnd;
    });

    let bestCombo = [];
    let bestScore = 0;
    const budget = touristInfo.budget;

    // Simple greedy algorithm for demonstration
    const sortedActivities = [...validActivities]
      .sort((a, b) => calculatePreferenceScore(b) - calculatePreferenceScore(a));

    const selectedActivities = [];
    let totalCost = 0;

    for (const activity of sortedActivities) {
      if (totalCost + activity.cost <= budget) {
        // Check for time conflicts
        const hasConflict = selectedActivities.some(selected => 
          hasTimeConflict(selected, activity));
        
        if (!hasConflict) {
          selectedActivities.push(activity);
          totalCost += activity.cost;
        }
      }
    }

    return selectedActivities.sort((a, b) => {
      if (a.date !== b.date) return new Date(a.date) - new Date(b.date);
      return timeToMinutes(a.start_time) - timeToMinutes(b.start_time);
    });
  };

  // Main data loading effect
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [touristData, activitiesData, preferencesData] = await Promise.all([
          fetchTouristInfo(),
          fetchActivities(),
          fetchFromDatabase(`/api/prefer/${touristId}`, true)
        ]);

        setTouristInfo(touristData);
        setActivities(activitiesData);
        setPreferences(preferencesData || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [touristId]);

  // Generate itinerary when data changes
  useEffect(() => {
    if (touristInfo && activities.length > 0) {
      const optimal = generateOptimalItinerary();
      setOptimalActivities(optimal);
    }
  }, [touristInfo, activities]);

  // Render helpers
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'long', month: 'long', day: 'numeric' 
    });
  };

  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h) % 12 || 12;
    const ampm = parseInt(h) < 12 ? 'AM' : 'PM';
    return `${hour}:${m} ${ampm}`;
  };

  // Component rendering
  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800">Travel Itinerary Planner</h1>
        <div className="flex items-center mt-4">
          <label className="mr-2">User ID:</label>
          <input
            type="number"
            value={touristId}
            onChange={(e) => setTouristId(parseInt(e.target.value) || 1)}
            className="border p-2 rounded"
            min="1"
          />
        </div>
      </header>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading your itinerary...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && touristInfo && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Trip Information</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p><strong>Dates:</strong> {formatDate(touristInfo.trip_start)} to {formatDate(touristInfo.trip_end)}</p>
            <p><strong>Budget:</strong> ${touristInfo.budget.toFixed(2)}</p>
            <p><strong>Daily Hours:</strong> {formatTime(touristInfo.preferred_start)} to {formatTime(touristInfo.preferred_end)}</p>
            {touristInfo.address && <p><strong>Location:</strong> {touristInfo.address}</p>}
          </div>
        </section>
      )}

      {!loading && optimalActivities.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Itinerary</h2>
          <div className="space-y-6">
            {optimalActivities.reduce((groups, activity) => {
              const date = activity.date;
              if (!groups[date]) groups[date] = [];
              groups[date].push(activity);
              return groups;
            }, {}).map((dateActivities, date) => (
              <div key={date} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b">
                  <h3 className="font-semibold">{formatDate(date)}</h3>
                </div>
                <div className="divide-y">
                  {dateActivities.map((activity) => (
                    <div key={activity.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg">{activity.name}</h4>
                          <p className="text-gray-600">
                            {formatTime(activity.start_time)} - {formatTime(activity.end_time)}
                            <span className="mx-2">•</span>
                            {activity.duration} mins
                            <span className="mx-2">•</span>
                            ${activity.cost.toFixed(2)}
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {activity.type}
                        </span>
                      </div>
                      {activity.description && (
                        <p className="mt-2 text-gray-700">{activity.description}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activity.tags.map(tag => (
                          <span key={tag} className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!loading && !error && optimalActivities.length === 0 && activities.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p>No activities fit your current budget and schedule constraints.</p>
        </div>
      )}
    </div>
  );
};

export default ItineraryPlanner;