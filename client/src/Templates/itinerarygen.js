import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import MapWithRouting from './MapWithRouting';
import "../css/itinerary.css";
import { Link } from 'react-router-dom';

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
  
  // Geocoding cache to avoid repeat requests
  const geocodingCache = useMemo(() => new Map(), []);

  // Optimized geocoding with controlled concurrency and caching
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

  // Batch geocoding with controlled concurrency (much faster)
  const batchGeocode = useCallback(async (addresses) => {
    const uniqueAddresses = [...new Set(addresses.filter(Boolean))];
    const results = new Map();
    
    // Process in batches of 5 with 200ms delay to respect rate limits but be much faster
    const batchSize = 5;
    const delay = 200; // Reduced from 1000ms
    
    for (let i = 0; i < uniqueAddresses.length; i += batchSize) {
      const batch = uniqueAddresses.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (address, index) => {
        // Stagger requests within batch
        await new Promise(resolve => setTimeout(resolve, index * 50));
        const coords = await geocodeAddress(address);
        return [address, coords];
      });
      
      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(([address, coords]) => {
        results.set(address, coords);
      });
      
      // Delay between batches
      if (i + batchSize < uniqueAddresses.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
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

  // Optimized time conflict checking
  const hasTimeConflict = useCallback((act1, act2) => {
    if (act1.date !== act2.date) return false;
    const s1 = timeToMinutes(act1.start_time);
    const e1 = s1 + act1.duration;
    const s2 = timeToMinutes(act2.start_time);
    const e2 = s2 + act2.duration;
    return !(e1 <= s2 || e2 <= s1);
  }, [timeToMinutes]);

  // Memoized date validation
  const validPreferredDates = useMemo(() => {
    if (!touristInfo?.preferred_dates) return [];
    
    const tripStart = new Date(touristInfo.trip_start);
    const tripEnd = new Date(touristInfo.trip_end);
    
    return touristInfo.preferred_dates.filter(dateStr => {
      const date = new Date(dateStr);
      return date >= tripStart && date <= tripEnd;
    });
  }, [touristInfo?.preferred_dates, touristInfo?.trip_start, touristInfo?.trip_end]);

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
      return activity.days_open?.[dayName] === true;
    }

    return false;
  }, []);

  // Optimized activity selection
  const selectOptimalActivities = useCallback((validActivities, budget) => {
    // Pre-calculate scores for all activities
    const scoredActivities = validActivities.map(activity => {
      const score = calculatePreferenceScore(activity);
      return {
        ...activity,
        score,
        efficiency: score / Math.max(activity.cost, 1)
      };
    });
    
    // Sort by efficiency once
    scoredActivities.sort((a, b) => b.efficiency - a.efficiency);
    
    const usedVenueNames = new Set();
    const selected = [];
    let totalCost = 0;
    
    // Optimized selection loop
    for (const activity of scoredActivities) {
      if (totalCost + activity.cost > budget) continue;
      if (selected.length >= 6) break;
      
      // Quick conflict check
      if (selected.some(existing => hasTimeConflict(existing, activity))) continue;
      
      // Venue duplicate check
      if (activity.type === 'venue' && usedVenueNames.has(activity.name)) continue;
      
      // Daily limit check
      const sameDay = selected.filter(existing => existing.date === activity.date);
      if (sameDay.length >= 3) continue;
      
      selected.push(activity);
      totalCost += activity.cost;
      
      if (activity.type === 'venue') {
        usedVenueNames.add(activity.name);
      }
    }
    
    return selected;
  }, [calculatePreferenceScore, hasTimeConflict]);

  // Optimized time adjustment calculation
  const calculateAdjustedTimes = useCallback((activities) => {
    if (!activities.length) return [];
    
    // Group by date efficiently
    const activitiesByDate = activities.reduce((acc, activity) => {
      const date = activity.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(activity);
      return acc;
    }, {});
    
    const adjustedActivities = [];
    
    Object.keys(activitiesByDate).forEach(date => {
      const dayActivities = activitiesByDate[date].sort((a, b) => 
        a.start_time.localeCompare(b.start_time)
      );
      
      for (let i = 0; i < dayActivities.length; i++) {
        const activity = { ...dayActivities[i] };
        
        if (i === 0) {
          activity.original_start_time = activity.start_time;
          activity.adjusted_start_time = activity.start_time;
          activity.adjusted_end_time = calculateEndTime(activity.start_time, activity.duration);
        } else {
          const previousActivity = adjustedActivities[adjustedActivities.length - 1];
          const travelTime = getTravelTime(previousActivity.id, activity.id);
          
          const previousEndMinutes = timeToMinutes(previousActivity.adjusted_end_time);
          const bufferTime = Math.max(travelTime, 15);
          const newStartMinutes = previousEndMinutes + bufferTime;
          
          activity.original_start_time = activity.start_time;
          activity.adjusted_start_time = minutesToTime(newStartMinutes);
          activity.adjusted_end_time = minutesToTime(newStartMinutes + activity.duration);
          activity.travel_time_from_previous = travelTime;
          activity.buffer_time = bufferTime;
        }
        
        adjustedActivities.push(activity);
      }
    });
    
    return adjustedActivities;
  }, [calculateEndTime, getTravelTime, timeToMinutes, minutesToTime]);

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


  // Optimized data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Parallel API calls
        const [touristResponse, venuesResponse, eventsResponse] = await Promise.all([
          axios.get(`http://localhost:5001/api/prefer/tourists/${touristId}`),
          axios.get('http://localhost:5001/api/venues/'),
          axios.get('http://localhost:5001/api/events')
        ]);

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

        // Calculate valid dates first
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

        // Collect all unique addresses for batch geocoding
        const allAddresses = [
          ...venuesResponse.data.filter(v => v.is_active).map(v => v.address),
          ...eventsResponse.data.map(e => e.venue_location)
        ];

        // Batch geocode all addresses concurrently
        console.log('Starting batch geocoding for', allAddresses.length, 'addresses...');
        const geocodedAddresses = await batchGeocode(allAddresses);
        console.log('Geocoding complete!');

        // Process data efficiently
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
        
        // Process events efficiently
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

    // Filter activities efficiently
    const validActivities = activities.filter(act => 
      fitsPreferredSlot(act) && 
      fitsPreferredDate(act) && 
      isVenueOpenOnActivityDate(act)
    );

    if (validActivities.length === 0) return [];

    const budget = parseFloat(touristInfo.budget) || 1200;
    const selectedActivities = selectOptimalActivities(validActivities, budget);
    
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
  const { totalCost, budget, adjustedActivitiesByDay } = useMemo(() => {
    const cost = optimalActivities.reduce((sum, act) => sum + act.cost, 0);
    const budgetValue = touristInfo?.budget ? parseFloat(touristInfo.budget) : 300;
    
    // Calculate adjusted times and group by day
    const adjustedActivities = calculateAdjustedTimes(optimalActivities);
    const grouped = adjustedActivities.reduce((acc, activity) => {
      const date = activity.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(activity);
      return acc;
    }, {});

    return { 
      totalCost: cost, 
      budget: budgetValue, 
      adjustedActivitiesByDay: grouped 
    };
  }, [optimalActivities, touristInfo?.budget, calculateAdjustedTimes]);

  const getTravelTimeBetween = useCallback((currentActivity, nextActivity) => {
    if (!routeData.length) return null;
    
    const route = routeData.find(r => r.from === currentActivity.id && r.to === nextActivity.id);
    return route ? {
      duration: route.durationText,
      distance: route.distanceText
    } : null;
  }, [routeData]);

  const downloadAsText = useCallback(() => {
  const generateItineraryText = () => {
    let content = `TRAVEL ITINERARY\n`;
    content += `==================\n\n`;
    
    if (touristInfo) {
      content += `Tourist: ${touristInfo.tourist_name || 'N/A'}\n`;
      content += `Trip Dates: ${new Date(touristInfo.trip_start).toLocaleDateString()} - ${new Date(touristInfo.trip_end).toLocaleDateString()}\n`;
      content += `Budget: $${budget}\n`;
      content += `Total Cost: $${totalCost.toFixed(2)}\n`;
      content += `Budget Remaining: $${(budget - totalCost).toFixed(2)}\n\n`;
    }

    Object.keys(adjustedActivitiesByDay)
      .sort((a, b) => a.localeCompare(b))
      .forEach(date => {
        content += `${new Date(date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}\n`;
        content += `${'='.repeat(50)}\n`;
        
        adjustedActivitiesByDay[date].forEach((activity, index) => {
          content += `\n${index + 1}. ${activity.name}\n`;
          content += `   Time: ${activity.adjusted_start_time} - ${activity.adjusted_end_time}\n`;
          content += `   Duration: ${activity.duration} minutes\n`;
          content += `   Cost: $${activity.cost}\n`;
          content += `   Location: ${activity.address || activity.venue_location}\n`;
          content += `   Type: ${activity.type.toUpperCase()}\n`;
          content += `   Category: ${activity.tags.join(', ')}\n`;
          
          if (activity.description) {
            content += `   Description: ${activity.description}\n`;
          }
          
          if (activity.travel_time_from_previous) {
            content += `   * Start time adjusted by ${activity.buffer_time} minutes (including ${activity.travel_time_from_previous} min travel)\n`;
          }
        });
        content += `\n`;
      });

    content += `\nSUMMARY\n`;
    content += `=======\n`;
    content += `Total Activities: ${optimalActivities.length}\n`;
    content += `Total Days: ${Object.keys(adjustedActivitiesByDay).length}\n`;
    content += `Total Cost: $${totalCost.toFixed(2)}\n`;
    content += `Budget Remaining: $${(budget - totalCost).toFixed(2)}\n`;

    return content;
  };

  const content = generateItineraryText();
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `itinerary_${touristInfo?.tourist_name?.replace(/\s+/g, '_') || 'tourist'}_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}, [touristInfo, budget, totalCost, adjustedActivitiesByDay, optimalActivities]);
const openPrintView = useCallback(() => {
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Travel Itinerary</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .day-section { margin-bottom: 30px; page-break-inside: avoid; }
        .day-title { background: #f0f0f0; padding: 10px; font-weight: bold; }
        .activity { margin: 10px 0; padding: 10px; border-left: 3px solid #007bff; }
        .activity-header { font-weight: bold; }
        .activity-details { margin-top: 5px; font-size: 0.9em; color: #666; }
        .summary { margin-top: 30px; padding: 15px; background: #f8f9fa; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Travel Itinerary</h1>
        <p><strong>Tourist:</strong> ${touristInfo?.tourist_name || 'N/A'}</p>
        <p><strong>Trip:</strong> ${new Date(touristInfo?.trip_start).toLocaleDateString()} - ${new Date(touristInfo?.trip_end).toLocaleDateString()}</p>
        <p><strong>Budget:</strong> $${budget} | <strong>Total Cost:</strong> $${totalCost.toFixed(2)}</p>
      </div>
      
      ${Object.keys(adjustedActivitiesByDay)
        .sort((a, b) => a.localeCompare(b))
        .map(date => `
          <div class="day-section">
            <div class="day-title">
              ${new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            ${adjustedActivitiesByDay[date].map(activity => `
              <div class="activity">
                <div class="activity-header">
                  ${activity.adjusted_start_time} - ${activity.adjusted_end_time} | ${activity.name}
                </div>
                <div class="activity-details">
                  <strong>Cost:</strong> $${activity.cost} | 
                  <strong>Duration:</strong> ${activity.duration} min | 
                  <strong>Type:</strong> ${activity.type.toUpperCase()}<br>
                  <strong>Location:</strong> ${activity.address || activity.venue_location}<br>
                  ${activity.description ? `<strong>Description:</strong> ${activity.description}<br>` : ''}
                  ${activity.travel_time_from_previous ? `<em>Travel time from previous: ${activity.travel_time_from_previous} min</em>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `).join('')}
      
      <div class="summary">
        <h3>Summary</h3>
        <p><strong>Total Activities:</strong> ${optimalActivities.length}</p>
        <p><strong>Total Days:</strong> ${Object.keys(adjustedActivitiesByDay).length}</p>
        <p><strong>Total Cost:</strong> $${totalCost.toFixed(2)}</p>
        <p><strong>Budget Remaining:</strong> $${(budget - totalCost).toFixed(2)}</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
}, [touristInfo, budget, totalCost, adjustedActivitiesByDay, optimalActivities]);
  const downloadAsPDF = useCallback(async () => {
  try {
    const element = document.querySelector('.itinerary-recommendations-section');
    if (!element) return;

    // Create canvas from the itinerary section
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add tourist info header
    pdf.setFontSize(16);
    pdf.text(`Itinerary for ${touristInfo?.tourist_name || 'Tourist'}`, 20, 20);
    pdf.setFontSize(12);
    pdf.text(`Trip: ${new Date(touristInfo?.trip_start).toLocaleDateString()} - ${new Date(touristInfo?.trip_end).toLocaleDateString()}`, 20, 30);
    pdf.text(`Budget: $${budget} | Total Cost: $${totalCost.toFixed(2)}`, 20, 40);
    
    position = 50;
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 50;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `itinerary_${touristInfo?.tourist_name?.replace(/\s+/g, '_') || 'tourist'}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
}, [touristInfo, budget, totalCost]);
// Replace your existing DownloadButtons component with this:

const DownloadButtons = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (action) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="itinerary-download-section" style={{
      marginTop: '20px',
      padding: '20px',
      background: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <span style={{ fontSize: '1.2em', marginRight: '10px' }}>📥</span>
        <h3 style={{ margin: 0, color: '#333' }}>Download Itinerary</h3>
      </div>
      
      <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(0,123,255,0.3)',
            transition: 'all 0.3s ease',
            minWidth: '180px',
            justifyContent: 'space-between'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#0056b3';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,123,255,0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#007bff';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(0,123,255,0.3)';
          }}
        >
          <span>📥 Download Options</span>
          <span style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            fontSize: '12px'
          }}>
            ▼
          </span>
        </button>

        {isOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            backgroundColor: 'white',
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            zIndex: 1000,
            marginTop: '8px',
            overflow: 'hidden',
            animation: 'dropdownFadeIn 0.3s ease'
          }}>
            <button
              onClick={() => handleOptionClick(downloadAsPDF)}
              style={{
                width: '100%',
                padding: '14px 18px',
                backgroundColor: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#dc3545';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#333';
              }}
            >
              <span style={{ fontSize: '16px' }}>📄</span>
              <div>
                <div style={{ fontWeight: '500' }}>Download as PDF</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Save as PDF document</div>
              </div>
            </button>

            <button
              onClick={() => handleOptionClick(downloadAsText)}
              style={{
                width: '100%',
                padding: '14px 18px',
                backgroundColor: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
                borderTop: '1px solid #f1f3f4'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#28a745';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#333';
              }}
            >
              <span style={{ fontSize: '16px' }}>📝</span>
              <div>
                <div style={{ fontWeight: '500' }}>Download as Text File</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Save as text file</div>
              </div>
            </button>

            <button
              onClick={() => handleOptionClick(openPrintView)}
              style={{
                width: '100%',
                padding: '14px 18px',
                backgroundColor: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
                borderTop: '1px solid #f1f3f4'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#6c757d';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#333';
              }}
            >
              <span style={{ fontSize: '16px' }}>🖨️</span>
              <div>
                <div style={{ fontWeight: '500' }}>Print View</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Open print preview</div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
  return (
    <div className="itinerary-planner-container">
      <div className="p-6 max-w-5xl mx-auto bg-white">
        <div className="itinerary-planner-header">
          <h1 className="itinerary-planner-title">Tourist Itinerary Planner</h1>
          <h1><a href="/tourist-profile">Home</a></h1>
          <h2><Link to="/preferences">Edit Itinerary</Link></h2>

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
            <br />
            <div className="itinerary-loading-text">
              Loading a custom itinerary for you!...
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
            
            {Object.keys(adjustedActivitiesByDay)
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
                      {adjustedActivitiesByDay[date].length} {adjustedActivitiesByDay[date].length === 1 ? 'Activity' : 'Activities'}
                    </div>
                  </div>
                  
                  <div className="itinerary-day-activities-grid">
                    {adjustedActivitiesByDay[date].map((activity, index) => {
                      const nextActivity = adjustedActivitiesByDay[date][index + 1];
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
                                  {activity.adjusted_start_time} - {activity.adjusted_end_time}
                                  {activity.original_start_time !== activity.adjusted_start_time && (
                                    <div className="itinerary-time-adjustment">
                                      {/* <small style={{color: '#666', fontSize: '0.8em'}}>
                                        (Originally {activity.original_start_time} - {calculateEndTime(activity.original_start_time, activity.duration)})
                                      </small> */}
                                    </div>
                                  )}
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
                            
                            {activity.travel_time_from_previous && activity.travel_time_from_previous > 0 && (
                              <div className="itinerary-travel-adjustment" style={{
                                backgroundColor: '#f0f9ff',
                                border: '1px solid #bae6fd',
                                borderRadius: '6px',
                                padding: '8px',
                                margin: '8px 0',
                                fontSize: '0.9em'
                              }}>
                                {/* <span style={{color: '#0369a1'}}>
                                  ⏱️ Start time adjusted by {activity.buffer_time} minutes 
                                  (including {activity.travel_time_from_previous} min travel time)
                                </span> */}
                              </div>
                            )}
                            
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
                    {Object.keys(adjustedActivitiesByDay).length}
                  </div>
                </div>
                <DownloadButtons />
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