const express = require('express');
const router = express.Router();
const pool = require('../db');

//sending the tourist preference to the db
router.post("/preferences", async (req, res) => {
  const { preferences } = req.body;
  //const userId = req.user.id; 
  const tourist_id=10;
  try {
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
      const updateResult = await pool.query(
      "UPDATE tourist_preferences SET preferences = ? WHERE tourist_id = ?",
      [preferencesJson, tourist_id]
    );
    
    // If no rows were affected, insert a new record
    if (updateResult.affectedRows === 0) {
      await pool.query(
        "INSERT INTO tourist_preferences (tourist_id, preferences) VALUES (?, ?)",
        [tourist_id, preferencesJson]
      );
      console.log("New preferences record created for tourist_id:", tourist_id);
    } else {
      console.log("Preferences updated for tourist_id:", tourist_id);
    }
    
    res.status(200).json({ 
      message: "Preferences saved successfully",
      tourist_id: tourist_id,
      preferences_count: preferences.length
    });
    
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ 
      error: "Failed to save preferences",
      details: error.message 
    });
  }
});



// GET all preferences
router.get('/', async (req, res) => {
  try {
    const [prefers] = await pool.query('SELECT * FROM Preferences');
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
    const [tourist] = await pool.query('SELECT * FROM Preferences WHERE preference_id = ?', [req.params.id]);
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