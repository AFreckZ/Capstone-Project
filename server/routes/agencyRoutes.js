const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

//getting all the agencies
router.get('/', async (req,res)=>{
  try {
  
    const [agency] = await pool.query(
      'SELECT * FROM transportagency');

    if (agency.length === 0) {
      return res.status(404).json({ error: 'there are no agencies' });
    }

    res.json(agency);
  } catch (err) {
    console.error('Error fetching agency:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get agency info by user ID
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user access
    if (req.user.userId != userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const [agency] = await pool.query(
      'SELECT * FROM transportagency WHERE user_id = ?',
      [userId]
    );

    if (agency.length === 0) {
      return res.status(404).json({ error: 'Agency not found' });
    }

    res.json(agency[0]);
  } catch (err) {
    console.error('Error fetching agency:', err);
    res.status(500).json({ error: 'Database error' });
  }
});
// Get all available drivers across all agencies (for tourist transportation booking)
router.get('/drivers/available',  async (req, res) => {
  try {
    console.log('Fetching available drivers for transportation booking...');
    
    const query = `
      SELECT 
        d.driver_id,
        d.agency_id,
        d.driver_name,
        d.license_number,
        d.driver_status,
        ta.company_name,
        ta.travel_rate
      FROM driver d
      JOIN transportagency ta ON d.agency_id = ta.agency_id
      WHERE d.driver_status = 'Available'
      ORDER BY ta.company_name, d.driver_name
    `;
    
    const [drivers] = await pool.query(query);
    
    console.log(`Found ${drivers.length} available drivers`);
    res.json(drivers);
    
  } catch (err) {
    console.error('Error fetching available drivers:', err);
    res.status(500).json({ error: 'Database error' });
  }
});
// Get all drivers for an agency
router.get('/:agencyId/drivers', authenticateToken, async (req, res) => {
  try {
    const { agencyId } = req.params;
    const userId = req.user.userId;

    // Verify agency ownership
    const [agency] = await pool.query(
      'SELECT agency_id FROM transportagency WHERE user_id = ? AND agency_id = ?',
      [userId, agencyId]
    );

    if (agency.length === 0) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const [drivers] = await pool.query(
      'SELECT * FROM driver WHERE agency_id = ?',
      [agencyId]
    );

    res.json(drivers);
  } catch (err) {
    console.error('Error fetching drivers:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add new driver
router.post('/drivers', authenticateToken, async (req, res) => {
  try {
    const { agency_id, driver_name, license_number } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!driver_name || !license_number) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify agency ownership
    const [agency] = await pool.query(
      'SELECT agency_id FROM transportagency WHERE user_id = ? AND agency_id = ?',
      [userId, agency_id]
    );

    if (agency.length === 0) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Insert new driver
    const [result] = await pool.query(
      'INSERT INTO driver (agency_id, driver_name, license_number, driver_status) VALUES (?, ?, ?, "Available")',
      [agency_id, driver_name, license_number]
    );

    res.json({ 
      success: true,
      driver_id: result.insertId,
      message: 'Driver added successfully'
    });
  } catch (err) {
    console.error('Error adding driver:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update driver status
router.put('/drivers/:driverId/status', authenticateToken, async (req, res) => {
  try {
    const { driverId } = req.params;
    const { driver_status } = req.body;
    const userId = req.user.userId;

    // Verify valid status
    const validStatuses = ['Available', 'On Trip', 'Off Duty'];
    if (!validStatuses.includes(driver_status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Verify driver ownership
    const [driver] = await pool.query(
      `SELECT d.driver_id FROM driver d
       JOIN transportagency ta ON d.agency_id = ta.agency_id
       WHERE ta.user_id = ? AND d.driver_id = ?`,
      [userId, driverId]
    );

    if (driver.length === 0) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Update status
    await pool.query(
      'UPDATE driver SET driver_status = ? WHERE driver_id = ?',
      [driver_status, driverId]
    );

    res.json({ success: true, message: 'Driver status updated' });
  } catch (err) {
    console.error('Error updating driver status:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete driver
router.delete('/drivers/:driverId', authenticateToken, async (req, res) => {
  try {
    const { driverId } = req.params;
    const userId = req.user.userId;

    // Verify driver ownership
    const [driver] = await pool.query(
      `SELECT d.driver_id FROM driver d
       JOIN transportagency ta ON d.agency_id = ta.agency_id
       WHERE ta.user_id = ? AND d.driver_id = ?`,
      [userId, driverId]
    );

    if (driver.length === 0) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Delete driver
    await pool.query(
      'DELETE FROM driver WHERE driver_id = ?',
      [driverId]
    );

    res.json({ success: true, message: 'Driver deleted' });
  } catch (err) {
    console.error('Error deleting driver:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


router.put('/:agencyId/rate', authenticateToken, async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log
    
    const { agencyId } = req.params;
    const { travel_rate } = req.body;
    const userId = req.user.userId;

    // Validation
    if (travel_rate === undefined || isNaN(parseFloat(travel_rate))) {
      return res.status(400).json({ error: 'Valid travel_rate number required' });
    }

    // Ownership check
    const [agency] = await pool.query(
      'SELECT agency_id FROM transportagency WHERE user_id = ? AND agency_id = ?',
      [userId, agencyId]
    );

    if (!agency.length) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Update
    const [result] = await pool.query(
      'UPDATE transportagency SET travel_rate = ? WHERE agency_id = ?',
      [parseFloat(travel_rate), agencyId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agency not found' });
    }

    res.json({ 
      success: true,
      message: 'Rate updated',
      new_rate: parseFloat(travel_rate)
    });
    
  } catch (err) {
    console.error('Rate update error:', err);
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
});

module.exports = router;