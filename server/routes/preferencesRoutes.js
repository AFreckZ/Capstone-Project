const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const pool = require('../db');

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


router.post("/preferences", authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.query('START TRANSACTION');
    
    const { preferences } = req.body;
    const user_id = req.user.userId; 
    
    console.log('=== UPDATING PREFERENCES ===');
    console.log('User ID:', user_id);
    console.log('Preferences:', JSON.stringify(preferences, null, 2));
    console.log('=== END DATA ===');

    // Validate preferences
    if (!preferences || !Array.isArray(preferences) || preferences.length === 0) {
      return res.status(400).json({ 
        error: "Preferences cannot be empty. Please select at least one preference." 
      });
    }

    const isValidPreferences = preferences.every(pref => 
      pref && typeof pref === 'object' && pref.tag && typeof pref.weight === 'number'
    );
    
    if (!isValidPreferences) {
      return res.status(400).json({ 
        error: "Invalid preference format. Each preference must have 'tag' and 'weight' properties." 
      });
    }

    const preferencesJson = JSON.stringify(preferences);
    if (!preferencesJson || preferencesJson === '[]' || preferencesJson === 'null') {
      return res.status(400).json({ 
        error: "Preferences data is empty or invalid." 
      });
    }

    // Find the tourist_id for this user
    const [touristResult] = await connection.query(
      "SELECT tourist_id FROM tourist WHERE user_id = ?",
      [user_id]
    );

    if (touristResult.length === 0) {
      return res.status(404).json({ 
        error: "Tourist profile not found. Please complete your trip setup first." 
      });
    }

    const tourist_id = touristResult[0].tourist_id;
    console.log('Found tourist_id:', tourist_id);

    // Update or insert preferences
    const [updateResult] = await connection.query(
      "UPDATE tourist_preferences SET preferences = ?, updated_at = NOW() WHERE tourist_id = ?",
      [preferencesJson, tourist_id]
    );

    if (updateResult.affectedRows === 0) {
      // Insert new preferences record
      await connection.query(
        "INSERT INTO tourist_preferences (tourist_id, preferences) VALUES (?, ?)",
        [tourist_id, preferencesJson]
      );
      console.log("New preferences record created for tourist_id:", tourist_id);
    } else {
      console.log("Preferences updated for tourist_id:", tourist_id);
    }

    await connection.query('COMMIT');
    
    res.status(200).json({ 
      message: "Preferences updated successfully",
      user_id: user_id,
      tourist_id: tourist_id,
      preferences_count: preferences.length,
      top_preference: preferences[0]?.tag,
      updated_preferences: preferences
    });
    
  } catch (error) {
    await connection.query('ROLLBACK');
    console.error("Database error:", error);
    res.status(500).json({ 
      error: "Failed to update preferences",
      details: error.message 
    });
  } finally {
    connection.release();
  }
});
// GET all preferences
router.get('/', async (req, res) => {
  try {
    const [prefers] = await pool.query('SELECT * FROM Tourist_Preferences');
    res.json(prefers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

//get all the tourists and their preferences
router.get('/tourists', async (req,res) =>{
    try{
        const[tourpre] = await pool.query('Select * from Tourist_Preferences p Join Tourist t Where p.tourist_id = t.tourist_id');
        res.json(tourpre);
    }catch (err){
        console.error(err);
        res.status(500).json({error: 'Failed to fetch tourists preferences'});
    }
})

// getting tourist preferences by their id
router.get('/tourists/:id', async (req,res) =>{
    try{
        const[tourpre] = await pool.query('Select * from Tourist_Preferences p Join Tourist t on p.tourist_id = t.tourist_id WHERE t.tourist_id = ?', [req.params.id]);
        res.json(tourpre);
    }catch (err){
        console.error(err);
        res.status(500).json({error: 'Failed to fetch tourists preferences by id '});
    }
})
// GET single preference
router.get('/:id', async (req, res) => {
  try {
    const [tourist] = await pool.query('SELECT preferences FROM Tourist_Preferences WHERE tourist_id = ?', [req.params.id]);
    if (tourist.length === 0) {
      return res.status(404).json({ error: 'Preference not found' });
    }
    res.json(tourist[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch preference' });
  }
});

module.exports = router;