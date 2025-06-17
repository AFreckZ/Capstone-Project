import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapWithRouting = ({ activities, selectedActivity, onRouteCalculated }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeLayerRef = useRef(null);
  const [mapLoading, setMapLoading] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map centered on Jamaica
    mapInstanceRef.current = L.map(mapRef.current).setView([18.1096, -77.2975], 10);

    // AddingpenStreetMap tiles 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add markers for activities
  useEffect(() => {
    if (!mapInstanceRef.current || !activities.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    activities.forEach((activity, index) => {
      if (activity.coordinates) {
        const [lat, lng] = activity.coordinates;
        
        // Create custom icon based on activity type
        const iconColor = activity.type === 'event' ? '#dc2626' : '#1d4ed8';
        const icon = L.divIcon({
          html: `<div style="
            background-color: ${iconColor};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
          ">${index + 1}</div>`,
          className: 'custom-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker([lat, lng], { icon })
          .bindPopup(`
            <div style="font-family: Inter, sans-serif;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px;">${activity.name}</h3>
              <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">${activity.start_time} - ${activity.end_time || 'N/A'}</p>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">${activity.address || activity.venue_location || 'Location not specified'}</p>
            </div>
          `)
          .addTo(mapInstanceRef.current);

        markersRef.current.push(marker);
      }
    });

    // Fit map to show all markers
    if (markersRef.current.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [activities]);

  // Calculate and display route for selected activity
  useEffect(() => {
    if (!selectedActivity || !activities.length || !mapInstanceRef.current) return;

    const selectedIndex = activities.findIndex(act => act.id === selectedActivity.id);
    if (selectedIndex === -1) return;

    // Get activities for the same day, sorted by time
    const sameDay = activities
      .filter(act => act.date === selectedActivity.date)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    if (sameDay.length < 2) return;

    calculateRoutes(sameDay);
  }, [selectedActivity, activities]);

  const calculateRoutes = async (dayActivities) => {
    if (!mapInstanceRef.current) return;

    setMapLoading(true);

    // Clear existing routes
    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
    }

    try {
      const routeGroup = L.layerGroup();
      const routeData = [];

      for (let i = 0; i < dayActivities.length - 1; i++) {
        const currentActivity = dayActivities[i];
        const nextActivity = dayActivities[i + 1];

        if (currentActivity.coordinates && nextActivity.coordinates) {
          const route = await getRoute(currentActivity.coordinates, nextActivity.coordinates);
          
          if (route) {
            // Add route to map
            const routeLine = L.polyline(route.coordinates, {
              color: '#ff5b7f',
              weight: 4,
              opacity: 0.8,
              smoothFactor: 1
            });

            routeLine.bindPopup(`
              <div style="font-family: Inter, sans-serif;">
                <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px;">
                  ${currentActivity.name} → ${nextActivity.name}
                </h4>
                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">
                  Distance: ${route.distance}
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 12px;">
                  Travel time: ${route.duration}
                </p>
                <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 10px;">
                  via OSRM (Free)
                </p>
              </div>
            `);

            routeGroup.addLayer(routeLine);

            routeData.push({
              from: currentActivity.id,
              to: nextActivity.id,
              distance: route.distanceValue,
              duration: route.durationValue,
              distanceText: route.distance,
              durationText: route.duration
            });
          }
        }
      }

      routeLayerRef.current = routeGroup;
      mapInstanceRef.current.addLayer(routeGroup);

      // Callback with route data for itinerary calculations
      if (onRouteCalculated && routeData.length > 0) {
        onRouteCalculated(routeData);
      }

    } catch (error) {
      console.error('Error calculating routes:', error);
    } finally {
      setMapLoading(false);
    }
  };

  // FREE routing using OSRM (no API key required)
  const getRoute = async (start, end) => {
    try {
      // Use FREE OSRM service (no API key required!)
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
      
      const response = await fetch(osrmUrl);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]); // Flip coordinates for Leaflet
        
        return {
          coordinates,
          distance: `${(route.distance / 1000).toFixed(1)} km`,
          duration: `${Math.round(route.duration / 60)} min`,
          distanceValue: route.distance,
          durationValue: route.duration
        };
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
    
    return null;
  };

  return (
    <div className="map-container">
      <div 
        ref={mapRef} 
        className="map-instance"
        style={{ height: '400px', width: '100%', borderRadius: '1rem' }}
      />
      {mapLoading && (
        <div className="map-loading-overlay">
          <div className="map-loading-spinner"></div>
          <span>Calculating routes...</span>
        </div>
      )}
    </div>
  );
};

export default MapWithRouting;