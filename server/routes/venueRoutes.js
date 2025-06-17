const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

// GET all venues
router.get('/', async (req, res) => {
  try {
    const [venues] = await pool.query('SELECT * FROM Venue');
    res.json(venues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch venues' });
  }
});

// GET single venue
router.get('/:id', async (req, res) => {
  try {
    const [venue] = await pool.query('SELECT * FROM Venue WHERE venue_id = ?', [req.params.id]);
    if (venue.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    res.json(venue[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch venue' });
  }
});

//adding a venue to the database
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Validation function for venue data
const validateVenueData = (data) => {
    const errors = [];
    
    // Required fields
    if (!data.name || data.name.trim().length === 0) {
        errors.push('Venue name is required');
    }
    
    if (!data.venue_type) {
        errors.push('Venue type is required');
    }
    
    if (!data.address || data.address.trim().length === 0) {
        errors.push('Address is required');
    }
    
    // Validate venue type against allowed values
    const allowedTypes = [
        'Beach/River', 'Outdoor Adventure', 'Indoor Adventure',
        'Museum/Historical Site', 'Food & Dining (Local)', 
        'Food & Dining (Unique)', 'Club/Bar/Party', 'Live Music', 'Festival'
    ];
    
    if (data.venue_type && !allowedTypes.includes(data.venue_type)) {
        errors.push('Invalid venue type');
    }
    
    // Validate cost if provided
    if (data.cost !== null && data.cost !== undefined && (isNaN(data.cost) || data.cost < 0)) {
        errors.push('Cost must be a positive number');
    }
    
    // Validate coordinates if provided
    if (data.latitude !== null && data.latitude !== undefined) {
        if (isNaN(data.latitude) || data.latitude < -90 || data.latitude > 90) {
            errors.push('Latitude must be between -90 and 90');
        }
    }
    
    if (data.longitude !== null && data.longitude !== undefined) {
        if (isNaN(data.longitude) || data.longitude < -180 || data.longitude > 180) {
            errors.push('Longitude must be between -180 and 180');
        }
    }
    
    // Validate times
    if (data.opening_time && data.closing_time && data.opening_time >= data.closing_time) {
        errors.push('Closing time must be after opening time');
    }
    
    return errors;
};

// GET all venues
router.get('/', async (req, res) => {
  try {
    const [venues] = await pool.query('SELECT * FROM venues ORDER BY created_at DESC');
    
    // Parse JSON fields
    const parsedVenues = venues.map(venue => ({
      ...venue,
      days_open: venue.days_open ? JSON.parse(venue.days_open) : null
    }));
    
    res.json({
      venues: parsedVenues,
      count: parsedVenues.length
    });
  } catch (err) {
    console.error('Error fetching venues:', err);
    res.status(500).json({ error: 'Failed to fetch venues' });
  }
});

// GET single venue
router.get('/:id', async (req, res) => {
  try {
    const [venue] = await pool.query('SELECT * FROM venues WHERE venue_id = ?', [req.params.id]);
    
    if (venue.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    
    const venueData = venue[0];
    if (venueData.days_open) {
      venueData.days_open = JSON.parse(venueData.days_open);
    }
    
    res.json({ venue: venueData });
  } catch (err) {
    console.error('Error fetching venue:', err);
    res.status(500).json({ error: 'Failed to fetch venue' });
  }
});

// POST /api/venues/create - Create a new venue
router.post('/create', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const venueData = req.body;
    const user_id = req.user.userId; // Use authenticated user ID
    
    console.log('=== RECEIVED VENUE DATA ===');
    console.log('Venue Data:', JSON.stringify(venueData, null, 2));
    console.log('User ID:', user_id);
    console.log('=== END RECEIVED DATA ===');

    // Validate input data
    const validationErrors = validateVenueData(venueData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // Validate days_open if provided
    if (venueData.days_open && !Array.isArray(venueData.days_open)) {
      return res.status(400).json({
        error: 'days_open must be an array'
      });
    }

    const daysOpenJson = venueData.days_open ? JSON.stringify(venueData.days_open) : null;

    await connection.query('START TRANSACTION');

    // Insert venue
    const [result] = await connection.query(
      `INSERT INTO venues (
        name, venue_type, opening_time, closing_time, cost,
        address, description, days_open, latitude, longitude
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        venueData.name.trim(),
        venueData.venue_type,
        venueData.opening_time || null,
        venueData.closing_time || null,
        venueData.cost || null,
        venueData.address.trim(),
        venueData.description ? venueData.description.trim() : null,
        daysOpenJson,
        venueData.latitude || null,
        venueData.longitude || null
      ]
    );

    const venue_id = result.insertId;
    console.log("New venue created with venue_id:", venue_id);

    // Get the created venue details
    const [createdVenue] = await connection.query(
      'SELECT * FROM venues WHERE venue_id = ?',
      [venue_id]
    );

    await connection.query('COMMIT');

    const venue = createdVenue[0];
    
    // Parse JSON fields for response
    if (venue.days_open) {
      venue.days_open = JSON.parse(venue.days_open);
    }

    console.log('Venue created successfully:', venue);

    res.status(201).json({
      message: 'Venue created successfully',
      venue: venue,
      venue_id: venue_id,
      user_id: user_id,
      venue_details: {
        name: venueData.name,
        type: venueData.venue_type,
        address: venueData.address,
        cost: venueData.cost ? `JMD $${venueData.cost}` : 'Free',
        operating_hours: venueData.opening_time && venueData.closing_time 
          ? `${venueData.opening_time} - ${venueData.closing_time}` 
          : 'Not specified',
        days_count: venueData.days_open ? venueData.days_open.length : 0
      }
    });

  } catch (error) {
    await connection.query('ROLLBACK');
    console.error('DB error:', error);
    
    // Handle specific database errors
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({
        error: 'A venue with this name already exists'
      });
    } else if (error.code === 'ER_DATA_TOO_LONG') {
      res.status(400).json({
        error: 'One or more fields exceed maximum length'
      });
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      res.status(500).json({
        error: 'Database access denied. Check your credentials.'
      });
    } else if (error.code === 'ECONNREFUSED') {
      res.status(500).json({
        error: 'Cannot connect to database. Make sure MySQL is running.'
      });
    } else {
      res.status(500).json({
        error: 'Failed to create venue',
        details: error.message
      });
    }
  } finally {
    connection.release();
  }
});
module.exports = router;