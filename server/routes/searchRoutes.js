const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/test', (req, res) => {
  console.log('Search test route hit!');
  res.json({ 
    message: 'Search routes are working!', 
    timestamp: new Date().toISOString(),
    port: 5001
  });
});


// GET search venues and events
router.get('/', async (req, res) => {
  try {
    const {
      query = '',
      type = 'all', // 'venues', 'events', 'all'
      location = '',
      venue_type = '',
      event_type = '',
      date_from = '',
      date_to = '',
      min_cost = '',
      max_cost = '',
      sort_by = 'name', // 'name', 'cost', 'date'
      sort_order = 'ASC', // 'ASC', 'DESC'
      page = 1,
      limit = 20
    } = req.query;

    console.log('=== SEARCH REQUEST ===');
    console.log('Query params:', req.query);

    const offset = (parseInt(page) - 1) * parseInt(limit);
    let results = [];

    // Search venues if requested
    if (type === 'all' || type === 'venues') {
      let venueQuery = `
        SELECT 
          v.*,
          'venue' as result_type,
          CASE 
            WHEN v.is_active = 1 THEN 'active'
            WHEN v.is_active = 0 THEN 'inactive'
            ELSE 'pending'
          END as status_text
        FROM venue v 
        WHERE v.is_active = 1
      `;
      
      const venueParams = [];

      // Add search conditions
      if (query) {
        venueQuery += ` AND (v.name LIKE ? OR v.description LIKE ? OR v.address LIKE ?)`;
        const searchTerm = `%${query}%`;
        venueParams.push(searchTerm, searchTerm, searchTerm);
      }

      if (location) {
        venueQuery += ` AND v.address LIKE ?`;
        venueParams.push(`%${location}%`);
      }

      if (venue_type) {
        venueQuery += ` AND v.venue_type = ?`;
        venueParams.push(venue_type);
      }

      if (min_cost) {
        venueQuery += ` AND v.cost >= ?`;
        venueParams.push(parseFloat(min_cost));
      }

      if (max_cost) {
        venueQuery += ` AND v.cost <= ?`;
        venueParams.push(parseFloat(max_cost));
      }

      // Add sorting
      if (sort_by === 'cost') {
        venueQuery += ` ORDER BY v.cost ${sort_order}`;
      } else {
        venueQuery += ` ORDER BY v.name ${sort_order}`;
      }

      console.log('Venue query:', venueQuery);
      console.log('Venue params:', venueParams);

      const [venues] = await pool.query(venueQuery, venueParams);
      results = results.concat(venues);
    }

    // Search events if requested
    if (type === 'all' || type === 'events') {
      let eventQuery = `
        SELECT 
          e.*,
          'event' as result_type
        FROM event e 
        WHERE e.start_datetime >= NOW()
      `;
      
      const eventParams = [];

      // Add search conditions
      if (query) {
        eventQuery += ` AND (e.name LIKE ? OR e.description LIKE ? OR e.venue_location LIKE ?)`;
        const searchTerm = `%${query}%`;
        eventParams.push(searchTerm, searchTerm, searchTerm);
      }

      if (location) {
        eventQuery += ` AND e.venue_location LIKE ?`;
        eventParams.push(`%${location}%`);
      }

      if (event_type) {
        eventQuery += ` AND e.event_type = ?`;
        eventParams.push(event_type);
      }

      if (date_from) {
        eventQuery += ` AND e.start_datetime >= ?`;
        eventParams.push(date_from);
      }

      if (date_to) {
        eventQuery += ` AND e.start_datetime <= ?`;
        eventParams.push(date_to);
      }

      if (min_cost) {
        eventQuery += ` AND e.cost >= ?`;
        eventParams.push(parseFloat(min_cost));
      }

      if (max_cost) {
        eventQuery += ` AND e.cost <= ?`;
        eventParams.push(parseFloat(max_cost));
      }

      // Add sorting
      if (sort_by === 'cost') {
        eventQuery += ` ORDER BY e.cost ${sort_order}`;
      } else if (sort_by === 'date') {
        eventQuery += ` ORDER BY e.start_datetime ${sort_order}`;
      } else {
        eventQuery += ` ORDER BY e.name ${sort_order}`;
      }

      console.log('Event query:', eventQuery);
      console.log('Event params:', eventParams);

      const [events] = await pool.query(eventQuery, eventParams);
      results = results.concat(events);
    }

    // Sort combined results if searching both
    if (type === 'all') {
      results.sort((a, b) => {
        let aValue, bValue;
        
        if (sort_by === 'cost') {
          aValue = a.cost || 0;
          bValue = b.cost || 0;
        } else if (sort_by === 'date') {
          aValue = a.start_datetime || a.created_at || '1900-01-01';
          bValue = b.start_datetime || b.created_at || '1900-01-01';
        } else {
          aValue = a.name || '';
          bValue = b.name || '';
        }

        if (sort_order === 'DESC') {
          return aValue < bValue ? 1 : -1;
        } else {
          return aValue > bValue ? 1 : -1;
        }
      });
    }

    // Apply pagination
    const totalResults = results.length;
    const paginatedResults = results.slice(offset, offset + parseInt(limit));

    const response = {
      results: paginatedResults,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalResults / parseInt(limit)),
        total_results: totalResults,
        per_page: parseInt(limit),
        has_next: offset + parseInt(limit) < totalResults,
        has_prev: parseInt(page) > 1
      },
      filters_applied: {
        query,
        type,
        location,
        venue_type,
        event_type,
        date_from,
        date_to,
        min_cost,
        max_cost,
        sort_by,
        sort_order
      }
    };

    console.log(`Found ${totalResults} total results, returning ${paginatedResults.length} for page ${page}`);
    res.json(response);

  } catch (err) {
    console.error('Error in search:', err);
    res.status(500).json({ 
      error: 'Search failed', 
      details: err.message,
      results: [],
      pagination: {
        current_page: 1,
        total_pages: 0,
        total_results: 0,
        per_page: parseInt(req.query.limit) || 20,
        has_next: false,
        has_prev: false
      }
    });
  }
  
});

// GET venue types for filter dropdown
router.get('/venue-types', async (req, res) => {
  try {
    const [types] = await pool.query(
      'SELECT DISTINCT venue_type FROM venue WHERE is_active = 1 ORDER BY venue_type'
    );
    res.json(types.map(t => t.venue_type));
  } catch (err) {
    console.error('Error fetching venue types:', err);
    res.status(500).json({ error: 'Failed to fetch venue types' });
  }
});

// GET event types for filter dropdown
router.get('/event-types', async (req, res) => {
  try {
    const [types] = await pool.query(
      'SELECT DISTINCT event_type FROM event WHERE start_datetime >= NOW() ORDER BY event_type'
    );
    res.json(types.map(t => t.event_type));
  } catch (err) {
    console.error('Error fetching event types:', err);
    res.status(500).json({ error: 'Failed to fetch event types' });
  }
});

// GET locations for filter dropdown
router.get('/locations', async (req, res) => {
  try {
    const [venueLocations] = await pool.query(
      'SELECT DISTINCT address as location FROM venue WHERE is_active = 1 AND address IS NOT NULL'
    );
    const [eventLocations] = await pool.query(
      'SELECT DISTINCT venue_location as location FROM event WHERE start_datetime >= NOW() AND venue_location IS NOT NULL'
    );

    const allLocations = [
      ...venueLocations.map(v => v.location),
      ...eventLocations.map(e => e.location)
    ];

    // Remove duplicates and sort
    const uniqueLocations = [...new Set(allLocations)].sort();
    res.json(uniqueLocations);
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// GET featured/popular venues and events
router.get('/featured', async (req, res) => {
  try {
    // Get some featured venues (you can modify this logic)
    const [featuredVenues] = await pool.query(`
      SELECT v.*, 'venue' as result_type,
             CASE 
               WHEN v.is_active = 1 THEN 'active'
               WHEN v.is_active = 0 THEN 'inactive'
               ELSE 'pending'
             END as status_text
      FROM venue v 
      WHERE v.is_active = 1 
      ORDER BY v.venue_id DESC 
      LIMIT 6
    `);

    // Get some upcoming events
    const [upcomingEvents] = await pool.query(`
      SELECT e.*, 'event' as result_type
      FROM event e 
      WHERE e.start_datetime >= NOW() 
      ORDER BY e.start_datetime ASC 
      LIMIT 6
    `);

    res.json({
      featured_venues: featuredVenues,
      upcoming_events: upcomingEvents
    });
  } catch (err) {
    console.error('Error fetching featured content:', err);
    res.status(500).json({ error: 'Failed to fetch featured content' });
  }
});

module.exports = router;