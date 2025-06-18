const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

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

// POST /api/venues/create 
router.post('/create', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const {
      name,
      venue_type,
      opening_time,
      closing_time,
      cost,
      address,
      description,
      days_open,
      user_id
    } = req.body;
    
    const authenticated_user_id = req.user.userId; // Get from JWT like tourists
    
    console.log('=== VENUE CREATION REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Authenticated user ID:', authenticated_user_id);
    console.log('=== END REQUEST DATA ===');

    // Validate required fields
    if (!name || !venue_type || !address) {
      return res.status(400).json({ 
        error: 'Name, venue type, and address are required' 
      });
    }

    // Security check: ensure user can only create venues for themselves
    const final_user_id = user_id || authenticated_user_id;
    if (final_user_id.toString() !== authenticated_user_id.toString()) {
      return res.status(403).json({ 
        error: 'You can only create venues for your own account' 
      });
    }

    await connection.query('START TRANSACTION');

    // getting the business id from the business owner table
    const [businessOwnerRecord] = await connection.query('SELECT bid FROM businessowner WHERE user_id = ?', [authenticated_user_id]);
    
    let bid;
    if (businessOwnerRecord.length > 0 && businessOwnerRecord[0].bid) {
      bid = businessOwnerRecord[0].bid;
      console.log('Found bid for user:', { user_id: authenticated_user_id, bid });
    } else {
      return res.status(400).json({ 
        error: 'No business found for this user. Please ensure you are registered as a business owner before creating venues.' 
      });
    }

    // Prepare venue data
    const venueData = {
      bid: bid, // Using bid as in your table structure
      name: name.trim(),
      venue_type,
      opening_time: opening_time || null,
      closing_time: closing_time || null,
      cost: cost ? parseFloat(cost) : null,
      address: address.trim(),
      description: description ? description.trim() : null,
      days_open: JSON.stringify(days_open || []), // Store as JSON like tourist preferences
      is_active: 1 // Set active by default
    };

    console.log('Prepared venue data:', venueData);

    // Insert venue into database using your table structure
    const [insertResult] = await connection.query(`
      INSERT INTO venue 
      (bid, name, venue_type, opening_time, closing_time, cost, address, description, days_open, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      venueData.bid,
      venueData.name,
      venueData.venue_type,
      venueData.opening_time,
      venueData.closing_time,
      venueData.cost,
      venueData.address,
      venueData.description,
      venueData.days_open,
      venueData.is_active
    ]);

    const venue_id = insertResult.insertId;
    console.log("New venue created with venue_id:", venue_id);

    await connection.query('COMMIT');

    // Return success response in your format
    res.status(201).json({
      message: 'Venue created successfully',
      venue_id: venue_id,
      bid: venueData.bid,
      user_id: authenticated_user_id,
      venue: {
        venue_id: venue_id,
        bid: venueData.bid,
        name: venueData.name,
        venue_type: venueData.venue_type,
        opening_time: venueData.opening_time,
        closing_time: venueData.closing_time,
        cost: venueData.cost,
        address: venueData.address,
        description: venueData.description,
        days_open: days_open || [],
        is_active: venueData.is_active
      }
    });

    console.log('=== VENUE CREATION SUCCESS ===');

  } catch (error) {
    await connection.query('ROLLBACK');
    console.error('=== VENUE CREATION ERROR ===');
    console.error('DB error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    // Handle specific database errors like tourists
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        error: 'A venue with this name already exists' 
      });
    }
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ 
        error: 'Venues table not found. Please ensure table exists.' 
      });
    }

    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({ 
        error: 'Database column error. Please check table structure.' 
      });
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ 
        error: 'Invalid user/business ID.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create venue',
      details: error.message 
    });
  } finally {
    connection.release();
  }
});

// GET venues for authenticated user
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;

    // First, get the user's bid using user_id (same pattern as tourist lookup)
    let bid;
    const [userRecord] = await pool.query('SELECT bid FROM users WHERE id = ?', [user_id]);
    if (userRecord.length > 0 && userRecord[0].bid) {
      bid = userRecord[0].bid;
    } else {
      const [businessRecord] = await pool.query('SELECT id as bid FROM businesses WHERE user_id = ?', [user_id]);
      if (businessRecord.length > 0) {
        bid = businessRecord[0].bid;
      } else {
        bid = user_id; // Fallback
      }
    }

    console.log('Getting venues for user:', { user_id, bid });

    // Get venues by the found bid
    const [venues] = await pool.query(`
      SELECT 
        venue_id,
        bid,
        name,
        venue_type,
        opening_time,
        closing_time,
        cost,
        address,
        description,
        days_open,
        is_active
      FROM venues 
      WHERE bid = ? AND is_active = 1
      ORDER BY venue_id DESC
    `, [bid]);

    // Parse days_open JSON for each venue
    const venuesWithParsedData = venues.map(venue => ({
      ...venue,
      days_open: venue.days_open ? JSON.parse(venue.days_open) : []
    }));

    res.json({
      venues: venuesWithParsedData,
      total: venuesWithParsedData.length,
      user_id: user_id
    });

  } catch (error) {
    console.error('Error fetching user venues:', error);
    res.status(500).json({ 
      error: 'Failed to fetch venues',
      details: error.message 
    });
  }
});
// // GET all venues
// router.get('/', async (req, res) => {
//   try {
//     const [venues] = await pool.query('SELECT * FROM venue');
    
//     // Parse JSON fields
//     const parsedVenues = venues.map(venue => ({
//       ...venue,
//       days_open: venue.days_open ? JSON.parse(venue.days_open) : null
//     }));
    
//     res.json({
//       venues: parsedVenues,
//       count: parsedVenues.length
//     });
//   } catch (err) {
//     console.error('Error fetching venues:', err);
//     res.status(500).json({ error: 'Failed to fetch venues' });
//   }
// });

// // GET single venue
// router.get('/:id', async (req, res) => {
//   try {
//     const [venue] = await pool.query('SELECT * FROM venue WHERE venue_id = ?', [req.params.id]);
    
//     if (venue.length === 0) {
//       return res.status(404).json({ error: 'Venue not found' });
//     }
    
//     const venueData = venue[0];
//     if (venueData.days_open) {
//       venueData.days_open = JSON.parse(venueData.days_open);
//     }
    
//     res.json({ venue: venueData });
//   } catch (err) {
//     console.error('Error fetching venue:', err);
//     res.status(500).json({ error: 'Failed to fetch venue' });
//   }
// });

// GET all venues
router.get('/', async (req, res) => {
  try {
    const [events] = await pool.query('SELECT * FROM venue');
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const [event] = await pool.query('SELECT * FROM venue WHERE venue_id = ?', [req.params.id]);
    if (event.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});
module.exports = router;