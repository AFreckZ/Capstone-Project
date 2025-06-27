// Updated routes/geocoding.js with all your actual venue/event addresses

const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const router = express.Router();
const geocodeCache = new NodeCache({ stdTTL: 86400 }); // 24hr cache

// Comprehensive Jamaica location coordinates based on your actual venue/event addresses
const jamaicaLocationFallbacks = {
  // Major Cities & Parishes
  'kingston': [17.9970, -76.7936],
  'montego bay': [18.4762, -77.8935],
  'negril': [18.2677, -78.3421],
  'ocho rios': [18.4058, -77.1033],
  'port antonio': [18.1745, -76.4492],
  'portmore': [17.9554, -76.8794],
  'falmouth': [18.4921, -77.6566],
  'spanish town': [17.9909, -76.9570],
  
  // Parishes
  'westmoreland': [18.2677, -78.3421],
  'st. catherine': [17.9554, -76.8794],
  'st. elizabeth': [18.0456, -77.5055],
  'st. ann': [18.4058, -77.1033],
  'trelawny': [18.4921, -77.6566],
  'portland': [18.1745, -76.4492],
  
  // Kingston Areas & Addresses
  'new kingston': [18.0179, -76.7943],
  'trench town': [17.9686, -76.7831],
  'port royal': [17.9362, -76.8430],
  'southaven': [17.9970, -76.7936],
  'hope rd': [18.0179, -76.7943],
  '56 hope rd': [18.0179, -76.7943],
  '26 hope rd': [18.0179, -76.7943],
  
  // Kingston Venues & Landmarks
  'emancipation park': [18.0179, -76.7943],
  'national gallery': [17.9688, -76.7831],
  'little theatre': [18.0166, -76.7947],
  'national stadium': [17.9688, -76.7636],
  'mas camp': [17.9970, -76.7936],
  'the deck': [17.9970, -76.7936],
  'jamworld': [17.9554, -76.8794],
  
  // Montego Bay Areas
  'gloucester ave': [18.4762, -77.8935],
  'hip strip': [18.4762, -77.8935],
  'rose hall': [18.4709, -77.9128],
  'border ave': [18.4762, -77.8935],
  'howard cooke blvd': [18.4762, -77.8935],
  'catherine hall': [18.5067, -77.9128],
  'half moon resort': [18.4709, -77.9128],
  
  // Negril Areas
  'west end road': [18.2677, -78.3421],
  'seven mile beach': [18.2677, -78.3421],
  
  // Other Specific Locations
  'discovery bay': [18.4556, -77.4064],
  'drax hall': [18.4058, -77.1033],
  'boston bay': [18.1745, -76.4492],
  'accompong town': [18.2421, -77.6128],
  'new castle': [18.0708, -76.6750],
  'tryall club': [18.2500, -78.0833],
  'plantation cove': [18.4058, -77.1033],
  'grizzly\'s plantation cove': [18.4058, -77.1033],
  'rock': [18.4921, -77.6566],
  
  // Portmore Areas
  'jamworld, portmore': [17.9554, -76.8794],
  
  // Generic fallbacks
  'various locations': [17.9970, -76.7936],
  'various stadiums': [17.9688, -76.7636],
  'various locations, kingston': [17.9970, -76.7936]
};

// Enhanced address matching function
const findBestCoordinates = (address) => {
  if (!address || typeof address !== 'string') {
    return jamaicaLocationFallbacks['kingston'];
  }
  
  const addressLower = address.toLowerCase().trim();
  
  // Direct match first
  if (jamaicaLocationFallbacks[addressLower]) {
    return jamaicaLocationFallbacks[addressLower];
  }
  
  // Partial matching - check if address contains any known locations
  for (const [location, coordinates] of Object.entries(jamaicaLocationFallbacks)) {
    if (addressLower.includes(location)) {
      return coordinates;
    }
  }
  
  // Special handling for common patterns
  if (addressLower.includes('kingston')) {
    return jamaicaLocationFallbacks['kingston'];
  }
  if (addressLower.includes('montego bay')) {
    return jamaicaLocationFallbacks['montego bay'];
  }
  if (addressLower.includes('negril')) {
    return jamaicaLocationFallbacks['negril'];
  }
  if (addressLower.includes('ocho rios')) {
    return jamaicaLocationFallbacks['ocho rios'];
  }
  if (addressLower.includes('portmore')) {
    return jamaicaLocationFallbacks['portmore'];
  }
  if (addressLower.includes('port antonio')) {
    return jamaicaLocationFallbacks['port antonio'];
  }
  if (addressLower.includes('st. ann')) {
    return jamaicaLocationFallbacks['st. ann'];
  }
  if (addressLower.includes('st. elizabeth')) {
    return jamaicaLocationFallbacks['st. elizabeth'];
  }
  if (addressLower.includes('westmoreland')) {
    return jamaicaLocationFallbacks['westmoreland'];
  }
  if (addressLower.includes('trelawny')) {
    return jamaicaLocationFallbacks['trelawny'];
  }
  if (addressLower.includes('portland')) {
    return jamaicaLocationFallbacks['portland'];
  }
  
  // Default to Kingston if no match found
  return jamaicaLocationFallbacks['kingston'];
};

// Single address geocoding function with improved fallback
const geocodeAddress = async (address) => {
  if (!address || typeof address !== 'string') return null;
  
  const cacheKey = address.toLowerCase().trim();
  
  // Check cache first
  const cached = geocodeCache.get(cacheKey);
  if (cached) {
    console.log(`📋 Cache hit for: ${address}`);
    return cached;
  }
  
  try {
    console.log(`🌍 Geocoding: ${address}`);
    
    // Try Nominatim API
    const nominatimUrl = `https://nominatim.openstreetmap.org/search`;
    const response = await axios.get(nominatimUrl, {
      params: {
        format: 'json',
        q: `${address}, Jamaica`,
        limit: 1,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'Jamaica-Tourism-App/1.0 (contact@jamaicatourism.com)',
        'Accept': 'application/json',
        'Accept-Language': 'en'
      },
      timeout: 8000 // 8 second timeout
    });
    
    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      const coordinates = [parseFloat(result.lat), parseFloat(result.lon)];
      
      // Verify coordinates are within Jamaica bounds
      const [lat, lng] = coordinates;
      if (lat >= 17.7 && lat <= 18.6 && lng >= -78.5 && lng <= -76.1) {
        geocodeCache.set(cacheKey, coordinates);
        console.log(`✅ Geocoded: ${address} -> ${coordinates}`);
        return coordinates;
      } else {
        console.warn(`⚠️ Coordinates outside Jamaica bounds for: ${address}`);
        throw new Error('Coordinates outside Jamaica');
      }
    }
    
    throw new Error('No results from Nominatim');
    
  } catch (error) {
    console.warn(`❌ Geocoding failed for ${address}: ${error.message}`);
    
    // Use improved fallback system
    const fallbackCoords = findBestCoordinates(address);
    console.log(`📍 Using fallback coordinates for: ${address} -> ${fallbackCoords}`);
    
    // Cache the fallback result
    geocodeCache.set(cacheKey, fallbackCoords);
    return fallbackCoords;
  }
};

// Batch geocoding endpoint
router.post('/batch', async (req, res) => {
  try {
    const { addresses } = req.body;
    
    if (!Array.isArray(addresses)) {
      return res.status(400).json({ error: 'Addresses must be an array' });
    }
    
    console.log(`🚀 Starting batch geocoding for ${addresses.length} addresses`);
    
    const results = {};
    const uniqueAddresses = [...new Set(addresses.filter(Boolean))];
    
    // Process addresses with controlled rate limiting
    for (let i = 0; i < uniqueAddresses.length; i++) {
      const address = uniqueAddresses[i];
      
      try {
        const coordinates = await geocodeAddress(address);
        results[address] = coordinates;
        
        // Rate limiting: wait between requests (only for non-cached results)
        if (i < uniqueAddresses.length - 1) {
          const wasFromCache = geocodeCache.get(address.toLowerCase().trim());
          if (!wasFromCache) {
            await new Promise(resolve => setTimeout(resolve, 300)); // 300ms delay
          }
        }
        
      } catch (error) {
        console.error(`Error geocoding ${address}:`, error.message);
        results[address] = findBestCoordinates(address);
      }
    }
    
    const successCount = Object.values(results).filter(coords => coords !== null).length;
    console.log(`✅ Batch geocoding complete. Success: ${successCount}/${uniqueAddresses.length}`);
    
    res.json(results);
    
  } catch (error) {
    console.error('Batch geocoding error:', error);
    res.status(500).json({ 
      error: 'Geocoding failed', 
      details: error.message 
    });
  }
});

// Single address geocoding endpoint
router.post('/single', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    
    const coordinates = await geocodeAddress(address);
    res.json({ address, coordinates });
    
  } catch (error) {
    console.error('Single geocoding error:', error);
    res.status(500).json({ 
      error: 'Geocoding failed', 
      details: error.message 
    });
  }
});

// Get cache statistics
router.get('/cache-stats', (req, res) => {
  const stats = geocodeCache.getStats();
  res.json({
    cacheStats: stats,
    cacheKeys: geocodeCache.keys().length,
    availableLocations: Object.keys(jamaicaLocationFallbacks).length
  });
});

// Clear cache endpoint
router.delete('/cache', (req, res) => {
  geocodeCache.flushAll();
  res.json({ message: 'Cache cleared successfully' });
});

// Get all available fallback locations
router.get('/locations', (req, res) => {
  res.json({
    message: 'Available fallback locations',
    locations: jamaicaLocationFallbacks,
    count: Object.keys(jamaicaLocationFallbacks).length
  });
});

module.exports = router;