const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

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

// Update agency travel rate
// Update agency travel rate - Fixed version
router.put('/:agencyId/rate', authenticateToken, async (req, res) => {
  try {
    const { agencyId } = req.params;
    const { travel_rate } = req.body;
    const userId = req.user.userId;

    console.log(`Updating rate for agency ${agencyId} with rate ${travel_rate}`); // Debug log

    // Validate input
    if (travel_rate === undefined || travel_rate === null || isNaN(parseFloat(travel_rate))) {
      return res.status(400).json({ error: 'Invalid rate provided' });
    }

    // Verify agency ownership
    const [agency] = await pool.query(
      'SELECT agency_id FROM transportagency WHERE user_id = ? AND agency_id = ?',
      [userId, agencyId]
    );

    if (agency.length === 0) {
      return res.status(403).json({ error: 'Unauthorized access to this agency' });
    }

    // Update rate
    const [result] = await pool.query(
      'UPDATE transportagency SET travel_rate = ? WHERE agency_id = ?',
      [parseFloat(travel_rate), agencyId]
    );

    console.log('Update result:', result); // Debug log

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agency not found or no changes made' });
    }

    res.json({ 
      success: true,
      message: 'Travel rate updated successfully',
      new_rate: travel_rate
    });
  } catch (err) {
    console.error('Error updating travel rate:', err);
    res.status(500).json({ 
      error: 'Failed to update travel rate',
      details: err.message
    });
  }
});
module.exports = router;