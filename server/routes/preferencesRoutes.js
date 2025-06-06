const express = require('express');
const router = express.Router();
const pool = require('../db');

//sending the tourist preference to the db
router.post("/preferences", async (req, res) => {
  const { preferences } = req.body;
  //const userId = req.user.id; 
  const tourist_id=1;

  try {
    await pool.query(
      "UPDATE tourist_preferences SET preferences = ? WHERE tourist_id = ?",
      [JSON.stringify(preferences), tourist_id]
    );
    if (updateResult.affectedRows === 0) {
    await pool.query(
      "INSERT INTO tourist_preferences (tourist_id, preference_id, preferences) VALUES (?, ?, ?)",
      [tourist_id, preference_id, JSON.stringify(preferences)]
    );
  }
    res.status(200).json({ message: "Preferences saved" });
  } catch (error) {
    console.error("DB error:", error);
    res.status(500).json({ error: "Failed to save preferences" });
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