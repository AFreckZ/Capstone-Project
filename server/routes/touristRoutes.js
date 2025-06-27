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
router.get('/user/:userId', async (req, res) => {
  try {
    const [tourist] = await pool.query(
      'SELECT tourist_id, user_id FROM tourist WHERE user_id = ?', 
      [req.params.userId]
    );
    
    if (tourist.length === 0) {
      return res.status(404).json({ error: 'Tourist profile not found' });
    }
    
    res.json(tourist[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tourist profile' });
  }
});

// GET all tourists
router.get('/', async (req, res) => {
  try {
    const [tourists] = await pool.query('SELECT * FROM Tourist');
    res.json(tourists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tourists' });
  }
});

// GET single tourist
router.get('/:id', async (req, res) => {
  try {
    const [tourist] = await pool.query('SELECT * FROM Tourist WHERE user_id = ?', [req.params.id]);
    if (tourist.length === 0) {
      return res.status(404).json({ error: 'Tourist not found' });
    }
    res.json(tourist[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tourist' });
  }
});

// entering tourist information
router.post('/save-preferences', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { tripData, weightedPreferences } = req.body;
    const user_id = req.user.userId; // Use authenticated user ID
    
    console.log('=== RECEIVED DATA ===');
    console.log('Trip Data:', JSON.stringify(tripData, null, 2));
    console.log('Sending preferences:', JSON.stringify(weightedPreferences, null, 2));
    console.log('=== END RECEIVED DATA ===');

    // Validate preferences (following your original validation)
    if (!weightedPreferences || !Array.isArray(weightedPreferences) || weightedPreferences.length === 0) {
      return res.status(400).json({ 
        error: "Preferences cannot be empty. Please select at least one preference." 
      });
    }

    const isValidPreferences = weightedPreferences.every(pref => 
      pref && typeof pref === 'object' && pref.tag && typeof pref.weight === 'number'
    );

    if (!isValidPreferences) {
      return res.status(400).json({ 
        error: "Invalid preference format. Each preference must have 'tag' and 'weight' properties." 
      });
    }

    const preferencesJson = JSON.stringify(weightedPreferences);
    if (!preferencesJson || preferencesJson === '[]' || preferencesJson === 'null') {
      return res.status(400).json({ 
        error: "Preferences data is empty or invalid." 
      });
    }

    await connection.query('START TRANSACTION');

    // First, try to update existing record in tourist table
    const [updateResult] = await connection.query(
      `UPDATE tourist SET 
        user_id = ?,
        trip_start = ?, 
        trip_end = ?, 
        budget = ?, 
        needTransportation=?,
        preferred_start = ?, 
        preferred_end = ?, 
        address = ?, 
        preferred_dates = ?
      WHERE user_id = ?`,
      [
        user_id,
        tripData.startDate,
        tripData.endDate,
        tripData.budget,
        0,
        tripData.preferredStartTime,
        tripData.preferredEndTime,
        tripData.accommodation || tripData.parish, // Use accommodation or parish as address
        JSON.stringify(tripData.preferredDays),
        user_id
      ]
    );

    let tourist_id;

    // If no rows were affected, insert a new record
    if (updateResult.affectedRows === 0) {
      const [insertResult] = await connection.query(
        `INSERT INTO tourist 
        (user_id, trip_start, trip_end, budget, needTransportion, preferred_start, preferred_end, address, preferred_dates) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          tripData.startDate,
          tripData.endDate,
          tripData.budget,
          tripData.needTransportation, 
          tripData.preferredStartTime,
          tripData.preferredEndTime,
          tripData.accommodation || tripData.parish,
          JSON.stringify(tripData.preferredDays)
        ]
      );
      tourist_id = insertResult.insertId;
      console.log("New tourist record created with tourist_id:", tourist_id);
    } else {
      // Get the tourist_id for the updated record
      const [touristRecord] = await connection.query(
        'SELECT tourist_id FROM tourist WHERE user_id = ?',
        [user_id]
      );
      tourist_id = touristRecord[0].tourist_id;
      console.log("Tourist record updated for tourist_id:", tourist_id);
    }

    // Insert or update preferences
    await connection.query(`
      INSERT INTO tourist_preferences (tourist_id, preferences) 
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE 
      preferences = VALUES(preferences), 
      updated_at = NOW()
    `, [tourist_id, preferencesJson]);

    await connection.query('COMMIT');

    res.status(200).json({ 
      message: "Preferences saved successfully",
      tourist_id: tourist_id,
      user_id: user_id,
      preferences_count: weightedPreferences.length,
      top_preference: weightedPreferences[0]?.tag,
      trip_data: {
        start_date: tripData.startDate,
        end_date: tripData.endDate,
        budget: tripData.budget,
        preferred_times: `${tripData.preferredStartTime} - ${tripData.preferredEndTime}`,
        address: tripData.accommodation || tripData.parish,
        preferred_dates_count: tripData.preferredDays.length
      },
      preferences_saved: weightedPreferences
    });

  } catch (error) {
    await connection.query('ROLLBACK');
    console.error("DB error:", error);
    res.status(500).json({ 
      error: "Failed to save preferences",
      details: error.message 
    });
  } finally {
    connection.release();
  }
});

module.exports = router;