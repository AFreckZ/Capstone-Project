// routes/search.js - Backend search functionality
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/search/events - Search events with multiple filters
router.get('/events', async (req, res) => {
  try {
    const {
      query,           // General search term
      location,        // Venue location search
      eventType,       // Event type filter
      dateFrom,        // Date range start
      dateTo,          // Date range end
      minCost,         // Cost range minimum
      maxCost,         // Cost range maximum
      sortBy = 'start_datetime',  // Sort field
      sortOrder = 'ASC',          // Sort direction
      page = 1,        // Pagination
      limit = 20       // Results per page
    } = req.query;

    console.log('Search request:', req.query);

    // Build WHERE clause dynamically
    let whereConditions = [];
    let queryParams = [];

    // General search (name and description)
    if (query && query.trim()) {
      whereConditions.push(`(
        e.name LIKE ? OR 
        e.description LIKE ? OR 
        e.venue_location LIKE ?
      )`);
      const searchTerm = `%${query.trim()}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Location search
    if (location && location.trim()) {
      whereConditions.push(`e.venue_location LIKE ?`);
      queryParams.push(`%${location.trim()}%`);
    }

    // Event type filter
    if (eventType && eventType !== 'all') {
      whereConditions.push(`e.event_type = ?`);
      queryParams.push(eventType);
    }

    // Date range filter
    if (dateFrom) {
      whereConditions.push(`DATE(e.start_datetime) >= ?`);
      queryParams.push(dateFrom);
    }
    if (dateTo) {
      whereConditions.push(`DATE(e.end_datetime) <= ?`);
      queryParams.push(dateTo);
    }

    // Cost range filter
    if (minCost !== undefined && minCost !== '') {
      whereConditions.push(`(e.cost >= ? OR e.cost IS NULL)`);
      queryParams.push(parseFloat(minCost));
    }
    if (maxCost !== undefined && maxCost !== '') {
      whereConditions.push(`(e.cost <= ? OR e.cost IS NULL)`);
      queryParams.push(parseFloat(maxCost));
    }

    // Only show future events by default
    whereConditions.push(`e.start_datetime >= NOW()`);

    // Combine WHERE conditions
    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Validate sort parameters
    const validSortFields = ['start_datetime', 'name', 'cost', 'event_type', 'venue_location'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'start_datetime';
    const finalSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 results per page
    const offset = (pageNum - 1) * limitNum;

    // Main search query
    const searchQuery = `
      SELECT 
        e.*,
        bo.business_name,
        DATE_FORMAT(e.start_datetime, '%Y-%m-%d %H:%i') as formatted_start,
        DATE_FORMAT(e.end_datetime, '%Y-%m-%d %H:%i') as formatted_end,
        CASE 
          WHEN e.cost IS NULL THEN 'Free'
          ELSE CONCAT('JMD $', FORMAT(e.cost, 0))
        END as formatted_cost
      FROM event e
      LEFT JOIN businessowner bo ON e.bid = bo.bid
      ${whereClause}
      ORDER BY e.${finalSortBy} ${finalSortOrder}
      LIMIT ? OFFSET ?
    `;

    const searchParams = [...queryParams, limitNum, offset];
    console.log('Search query:', searchQuery);
    console.log('Search params:', searchParams);

    const [events] = await pool.query(searchQuery, searchParams);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM event e
      LEFT JOIN businessowner bo ON e.bid = bo.bid
      ${whereClause}
    `;

    const [countResult] = await pool.query(countQuery, queryParams);
    const totalEvents = countResult[0].total;
    const totalPages = Math.ceil(totalEvents / limitNum);

    res.json({
      events,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalEvents,
        eventsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      filters: {
        query: query || '',
        location: location || '',
        eventType: eventType || 'all',
        dateFrom: dateFrom || '',
        dateTo: dateTo || '',
        minCost: minCost || '',
        maxCost: maxCost || '',
        sortBy: finalSortBy,
        sortOrder: finalSortOrder
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Failed to search events',
      details: error.message 
    });
  }
});

// GET /api/search/venues - Search unique venues
router.get('/venues', async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    let whereClause = '';
    let queryParams = [];

    if (query && query.trim()) {
      whereClause = 'WHERE e.venue_location LIKE ?';
      queryParams.push(`%${query.trim()}%`);
    }

    const venueQuery = `
      SELECT 
        e.venue_location,
        COUNT(*) as event_count,
        MIN(e.start_datetime) as next_event_date,
        GROUP_CONCAT(DISTINCT e.event_type) as event_types
      FROM event e
      ${whereClause}
      GROUP BY e.venue_location
      HAVING e.venue_location IS NOT NULL AND e.venue_location != ''
      ORDER BY event_count DESC, e.venue_location ASC
      LIMIT ?
    `;

    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const [venues] = await pool.query(venueQuery, [...queryParams, limitNum]);

    res.json({
      venues,
      total: venues.length
    });

  } catch (error) {
    console.error('Venue search error:', error);
    res.status(500).json({ 
      error: 'Failed to search venues',
      details: error.message 
    });
  }
});

// GET /api/search/suggestions - Auto-complete suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { query, type = 'all' } = req.query;

    if (!query || query.trim().length < 2) {
      return res.json({ suggestions: [] });
    }

    const searchTerm = `%${query.trim()}%`;
    let suggestions = [];

    // Event name suggestions
    if (type === 'all' || type === 'events') {
      const [eventNames] = await pool.query(`
        SELECT DISTINCT e.name as suggestion, 'event' as type
        FROM event e
        WHERE e.name LIKE ? AND e.start_datetime >= NOW()
        ORDER BY e.name
        LIMIT 5
      `, [searchTerm]);
      suggestions = suggestions.concat(eventNames);
    }

    // Venue suggestions
    if (type === 'all' || type === 'venues') {
      const [venues] = await pool.query(`
        SELECT DISTINCT e.venue_location as suggestion, 'venue' as type
        FROM event e
        WHERE e.venue_location LIKE ? AND e.start_datetime >= NOW()
        ORDER BY e.venue_location
        LIMIT 5
      `, [searchTerm]);
      suggestions = suggestions.concat(venues);
    }

    res.json({ suggestions: suggestions.slice(0, 10) });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ 
      error: 'Failed to get suggestions',
      details: error.message 
    });
  }
});

// GET /api/search/filters - Get available filter options
router.get('/filters', async (req, res) => {
  try {
    // Get all event types
    const [eventTypes] = await pool.query(`
      SELECT DISTINCT event_type, COUNT(*) as count
      FROM event 
      WHERE start_datetime >= NOW()
      GROUP BY event_type
      ORDER BY count DESC
    `);

    // Get location suggestions (top venues)
    const [locations] = await pool.query(`
      SELECT DISTINCT venue_location, COUNT(*) as count
      FROM event 
      WHERE start_datetime >= NOW() AND venue_location IS NOT NULL
      GROUP BY venue_location
      ORDER BY count DESC
      LIMIT 20
    `);

    // Get cost range
    const [costRange] = await pool.query(`
      SELECT 
        MIN(cost) as min_cost,
        MAX(cost) as max_cost,
        AVG(cost) as avg_cost
      FROM event 
      WHERE cost IS NOT NULL AND start_datetime >= NOW()
    `);

    res.json({
      eventTypes: eventTypes.map(et => ({
        value: et.event_type,
        label: et.event_type,
        count: et.count
      })),
      locations: locations.map(loc => ({
        value: loc.venue_location,
        label: loc.venue_location,
        count: loc.count
      })),
      costRange: costRange[0] || { min_cost: 0, max_cost: 10000, avg_cost: 2500 }
    });

  } catch (error) {
    console.error('Filters error:', error);
    res.status(500).json({ 
      error: 'Failed to get filter options',
      details: error.message 
    });
  }
});

module.exports = router;