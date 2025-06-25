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

// GET all business owners
router.get('/', async (req, res) => {
  try {
    const [businesses] = await pool.query('SELECT * FROM businessowner');
    res.json(businesses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch business owners' });
  }
});

// GET single business owner
router.get('/:id', async (req, res) => {
  try {
    const [business] = await pool.query('SELECT * FROM businessowner WHERE bid = ?', [req.params.id]);
    if (business.length === 0) {
      return res.status(404).json({ error: 'Business owner not found' });
    }
    res.json(business[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch business owner' });
  }
});

// GET all venues for a specific business owner
router.get('/venues/:businessId', authenticateToken, async (req, res) => {
  try {
    console.log('=== VENUES ROUTE DEBUG ===');
    const requestedBusinessId = req.params.businessId;
    const authenticatedUserId = req.user.userId;
    console.log('Requested Business ID:', requestedBusinessId);
    console.log('Authenticated user ID:', authenticatedUserId);
    
    // Verify that the authenticated user owns this business or is accessing their own data
    if (authenticatedUserId != requestedBusinessId) {
      console.log('Access denied - user mismatch');
      return res.status(403).json({ error: 'Access denied. You can only view your own venues.' });
    }

    // First, get the bid from the businessowner table
    console.log('Getting bid from businessowner table...');
    const [businessResult] = await pool.query(
      'SELECT bid FROM businessowner WHERE user_id = ?',
      [authenticatedUserId]
    );

    if (businessResult.length === 0) {
      console.log('Business owner not found in businessowner table');
      return res.status(404).json({ error: 'Business owner not found' });
    }

    const bid = businessResult[0].bid;
    console.log('Found bid (bid):', bid);

    if (!bid) {
      console.log('User has no associated business (bid is null)');
      return res.json([]); // Return empty array if user has no business
    }

    console.log('Running venue query with bid:', bid);
    const [venues] = await pool.query(
      `SELECT v.*, 
              CASE 
                WHEN v.is_active = 1 THEN 'active'
                WHEN v.is_active = 0 THEN 'inactive'
                ELSE 'pending'
              END as status_text
       FROM venue v 
       WHERE v.bid = ? 
       ORDER BY v.venue_id DESC`,
      [bid]
    );

    console.log('Query result:', venues);
    console.log('Number of venues found:', venues.length);
    console.log('=== END VENUES ROUTE DEBUG ===');

    res.json(venues);
  } catch (err) {
    console.error('Error fetching venues:', err);
    console.log('Full error details:', err);
    res.status(500).json({ error: 'Failed to fetch venues', details: err.message });
  }
});

// GET all events for a specific business owner
router.get('/events/:businessId', authenticateToken, async (req, res) => {
  try {
    console.log('=== EVENTS ROUTE DEBUG ===');
    const requestedBusinessId = req.params.businessId;
    const authenticatedUserId = req.user.userId;
    console.log('Requested Business ID:', requestedBusinessId);
    console.log('Authenticated user ID:', authenticatedUserId);
    
    // Verify that the authenticated user owns this business or is accessing their own data
    if (authenticatedUserId != requestedBusinessId) {
      console.log('Access denied - user mismatch');
      return res.status(403).json({ error: 'Access denied. You can only view your own events.' });
    }

    // First, get the bid from the businessowner table
    console.log('Getting bid from businessowner table...');
    const [businessResult] = await pool.query(
      'SELECT bid FROM businessowner WHERE user_id = ?',
      [authenticatedUserId]
    );

    if (businessResult.length === 0) {
      console.log('Business owner not found in businessowner table');
      return res.status(404).json({ error: 'Business owner not found' });
    }

    const bid = businessResult[0].bid;
    console.log('Found bid (bid):', bid);

    if (!bid) {
      console.log('User has no associated business (bid is null)');
      return res.json([]); // Return empty array if user has no business
    }

    console.log('Running event query with bid:', bid);
    const [events] = await pool.query(
      `SELECT e.*
       FROM event e 
       WHERE e.bid = ? 
       ORDER BY e.start_datetime ASC`,
      [bid]
    );

    console.log('Query result:', events);
    console.log('Number of events found:', events.length);
    console.log('=== END EVENTS ROUTE DEBUG ===');

    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    console.log('Full error details:', err);
    res.status(500).json({ error: 'Failed to fetch events', details: err.message });
  }
});

// GET single venue with ownership verification
router.get('/venue/:venueId', authenticateToken, async (req, res) => {
  try {
    const [venue] = await pool.query(
      `SELECT v.*, 
              CASE 
                WHEN v.is_active = 1 THEN 'active'
                WHEN v.is_active = 0 THEN 'inactive'
                ELSE 'pending'
              END as status_text
       FROM venue v 
       WHERE v.venue_id = ?`,
      [req.params.venueId]
    );

    if (venue.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    // Get the user's bid to verify ownership
    const [businessResult] = await pool.query(
      'SELECT bid FROM businessowner WHERE user_id = ?',
      [req.user.userId]
    );

    if (businessResult.length === 0 || businessResult[0].bid !== venue[0].bid) {
      return res.status(403).json({ error: 'Access denied. You can only view your own venues.' });
    }

    res.json(venue[0]);
  } catch (err) {
    console.error('Error fetching venue:', err);
    res.status(500).json({ error: 'Failed to fetch venue' });
  }
});

// GET single event with ownership verification
router.get('/event/:eventId', authenticateToken, async (req, res) => {
  try {
    const [event] = await pool.query(
      `SELECT e.*
       FROM event e 
       WHERE e.event_id = ?`,
      [req.params.eventId]
    );

    if (event.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get the user's bid to verify ownership
    const [businessResult] = await pool.query(
      'SELECT bid FROM businessowner WHERE user_id = ?',
      [req.user.userId]
    );

    if (businessResult.length === 0 || businessResult[0].bid !== event[0].bid) {
      return res.status(403).json({ error: 'Access denied. You can only view your own events.' });
    }

    res.json(event[0]);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// DELETE venue
router.delete('/venue/:venueId', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const venueId = req.params.venueId;

    // First, verify that the venue exists and get its bid
    const [venue] = await connection.query(
      'SELECT bid FROM venue WHERE venue_id = ?',
      [venueId]
    );

    if (venue.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    // Get the user's bid to verify ownership
    const [businessResult] = await connection.query(
      'SELECT bid FROM businessowner WHERE user_id = ?',
      [req.user.userId]
    );

    if (businessResult.length === 0 || businessResult[0].bid !== venue[0].bid) {
      return res.status(403).json({ error: 'Access denied. You can only delete your own venues.' });
    }

    await connection.query('START TRANSACTION');

    // Delete the venue
    const [deleteResult] = await connection.query(
      'DELETE FROM venue WHERE venue_id = ?',
      [venueId]
    );

    if (deleteResult.affectedRows === 0) {
      await connection.query('ROLLBACK');
      return res.status(404).json({ error: 'Venue not found or already deleted' });
    }

    await connection.query('COMMIT');

    res.json({ 
      message: 'Venue deleted successfully',
      venueId: venueId
    });

  } catch (err) {
    await connection.query('ROLLBACK');
    console.error('Error deleting venue:', err);
    res.status(500).json({ error: 'Failed to delete venue' });
  } finally {
    connection.release();
  }
});

// DELETE event
router.delete('/event/:eventId', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const eventId = req.params.eventId;

    // First, verify that the event exists and get its bid
    const [event] = await connection.query(
      'SELECT bid FROM event WHERE event_id = ?',
      [eventId]
    );

    if (event.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get the user's bid to verify ownership
    const [businessResult] = await connection.query(
      'SELECT bid FROM businessowner WHERE user_id = ?',
      [req.user.userId]
    );

    if (businessResult.length === 0 || businessResult[0].bid !== event[0].bid) {
      return res.status(403).json({ error: 'Access denied. You can only delete your own events.' });
    }

    await connection.query('START TRANSACTION');

    // Delete the event
    const [deleteResult] = await connection.query(
      'DELETE FROM event WHERE event_id = ?',
      [eventId]
    );

    if (deleteResult.affectedRows === 0) {
      await connection.query('ROLLBACK');
      return res.status(404).json({ error: 'Event not found or already deleted' });
    }

    await connection.query('COMMIT');

    res.json({ 
      message: 'Event deleted successfully',
      eventId: eventId
    });

  } catch (err) {
    await connection.query('ROLLBACK');
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Failed to delete event' });
  } finally {
    connection.release();
  }
});

// UPDATE venue status (active/inactive)
router.patch('/venue/:venueId/status', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const venueId = req.params.venueId;
    const { is_active } = req.body;

    // Validate status
    if (![0, 1].includes(is_active)) {
      return res.status(400).json({ error: 'Invalid status. Must be 0 (inactive) or 1 (active)' });
    }

    // Verify that the venue exists and get its bid
    const [venue] = await connection.query(
      'SELECT bid FROM venue WHERE venue_id = ?',
      [venueId]
    );

    if (venue.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    // Get the user's bid to verify ownership
    const [businessResult] = await connection.query(
      'SELECT bid FROM businessowner WHERE user_id = ?',
      [req.user.userId]
    );

    if (businessResult.length === 0 || businessResult[0].bid !== venue[0].bid) {
      return res.status(403).json({ error: 'Access denied. You can only update your own venues.' });
    }

    await connection.query('START TRANSACTION');

    const [updateResult] = await connection.query(
      'UPDATE venue SET is_active = ? WHERE venue_id = ?',
      [is_active, venueId]
    );

    if (updateResult.affectedRows === 0) {
      await connection.query('ROLLBACK');
      return res.status(404).json({ error: 'Venue not found' });
    }

    await connection.query('COMMIT');

    const statusText = is_active === 1 ? 'active' : 'inactive';

    res.json({ 
      message: 'Venue status updated successfully',
      venueId: venueId,
      newStatus: statusText
    });

  } catch (err) {
    await connection.query('ROLLBACK');
    console.error('Error updating venue status:', err);
    res.status(500).json({ error: 'Failed to update venue status' });
  } finally {
    connection.release();
  }
});

// UPDATE entire venue
router.put('/venue/:venueId', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const venueId = req.params.venueId;
    const { 
      name, 
      venue_type, 
      opening_time, 
      closing_time, 
      cost, 
      address, 
      description, 
      is_active, 
      days_open 
    } = req.body;

    // Verify ownership
    const [venue] = await connection.query(
      'SELECT bid FROM venue WHERE venue_id = ?',
      [venueId]
    );

    if (venue.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    // Get the user's bid to verify ownership
    const [businessResult] = await connection.query(
      'SELECT bid FROM businessowner WHERE user_id = ?',
      [req.user.userId]
    );

    if (businessResult.length === 0 || businessResult[0].bid !== venue[0].bid) {
      return res.status(403).json({ error: 'Access denied. You can only update your own venues.' });
    }

    await connection.query('START TRANSACTION');

    const [updateResult] = await connection.query(
      `UPDATE venue SET 
        name = ?, 
        venue_type = ?, 
        opening_time = ?, 
        closing_time = ?, 
        cost = ?, 
        address = ?, 
        description = ?, 
        is_active = ?, 
        days_open = ?
      WHERE venue_id = ?`,
      [name, venue_type, opening_time, closing_time, cost, address, description, is_active, JSON.stringify(days_open), venueId]
    );

    if (updateResult.affectedRows === 0) {
      await connection.query('ROLLBACK');
      return res.status(404).json({ error: 'Venue not found' });
    }

    await connection.query('COMMIT');

    res.json({ 
      message: 'Venue updated successfully',
      venueId: venueId
    });

  } catch (err) {
    await connection.query('ROLLBACK');
    console.error('Error updating venue:', err);
    res.status(500).json({ error: 'Failed to update venue' });
  } finally {
    connection.release();
  }
});

// UPDATE entire event
router.put('/event/:eventId', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const eventId = req.params.eventId;
    const { 
      name, 
      event_type, 
      start_datetime, 
      end_datetime, 
      venue_location, 
      cost, 
      description, 
      menu_image_path, 
      flyer_image_path 
    } = req.body;

    // Verify ownership
    const [event] = await connection.query(
      'SELECT bid FROM event WHERE event_id = ?',
      [eventId]
    );

    if (event.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get the user's bid to verify ownership
    const [businessResult] = await connection.query(
      'SELECT bid FROM businessowner WHERE user_id = ?',
      [req.user.userId]
    );

    if (businessResult.length === 0 || businessResult[0].bid !== event[0].bid) {
      return res.status(403).json({ error: 'Access denied. You can only update your own events.' });
    }

    await connection.query('START TRANSACTION');

    const [updateResult] = await connection.query(
      `UPDATE event SET 
        name = ?, 
        event_type = ?, 
        start_datetime = ?, 
        end_datetime = ?, 
        venue_location = ?, 
        cost = ?, 
        description = ?, 
        menu_image_path = ?, 
        flyer_image_path = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE event_id = ?`,
      [name, event_type, start_datetime, end_datetime, venue_location, cost, description, menu_image_path, flyer_image_path, eventId]
    );

    if (updateResult.affectedRows === 0) {
      await connection.query('ROLLBACK');
      return res.status(404).json({ error: 'Event not found' });
    }

    await connection.query('COMMIT');

    res.json({ 
      message: 'Event updated successfully',
      eventId: eventId
    });

  } catch (err) {
    await connection.query('ROLLBACK');
    console.error('Error updating event:', err);
    res.status(500).json({ error: 'Failed to update event' });
  } finally {
    connection.release();
  }
});

// GET business statistics
router.get('/stats/:businessId', authenticateToken, async (req, res) => {
  try {
    const requestedBusinessId = req.params.businessId;
    const authenticatedUserId = req.user.userId;
    
    // Verify that the authenticated user owns this business
    if (authenticatedUserId != requestedBusinessId) {
      return res.status(403).json({ error: 'Access denied. You can only view your own statistics.' });
    }

    // Get the bid from the businessowner table
    const [businessResult] = await pool.query(
      'SELECT bid FROM businessowner WHERE user_id = ?',
      [authenticatedUserId]
    );

    if (businessResult.length === 0) {
      return res.status(404).json({ error: 'Business owner not found' });
    }

    const bid = businessResult[0].bid;

    if (!bid) {
      // Return empty stats if user has no business
      return res.json({
        venues: { total: 0, active: 0, inactive: 0 },
        events: { total: 0, upcoming: 0, past: 0 }
      });
    }

    const [venueStats] = await pool.query(
      'SELECT COUNT(*) as total_venues, SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_venues FROM venue WHERE bid = ?',
      [bid]
    );

    const [eventStats] = await pool.query(
      'SELECT COUNT(*) as total_events FROM event WHERE bid = ?',
      [bid]
    );

    // Get upcoming vs past events
    const [eventTimeStats] = await pool.query(
      'SELECT SUM(CASE WHEN start_datetime > NOW() THEN 1 ELSE 0 END) as upcoming_events, SUM(CASE WHEN start_datetime <= NOW() THEN 1 ELSE 0 END) as past_events FROM event WHERE bid = ?',
      [bid]
    );

    const stats = {
      venues: {
        total: venueStats[0].total_venues,
        active: venueStats[0].active_venues,
        inactive: venueStats[0].total_venues - venueStats[0].active_venues
      },
      events: {
        total: eventStats[0].total_events,
        upcoming: eventTimeStats[0].upcoming_events,
        past: eventTimeStats[0].past_events
      }
    };

    res.json(stats);
  } catch (err) {
    console.error('Error fetching business statistics:', err);
    res.status(500).json({ error: 'Failed to fetch business statistics' });
  }
});

module.exports = router;