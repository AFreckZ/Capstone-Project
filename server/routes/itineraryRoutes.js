const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all itineraries
router.get('/', async (req, res) => {
  try {
    const [itineraries] = await pool.query('SELECT * FROM itinerary');
    res.json(itineraries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
});

// GET single intinerary
router.get('/:id', async (req, res) => {
  try {
    const [itinerary] = await pool.query('SELECT * FROM itinerary WHERE itinerary_id = ?', [req.params.id]);
    if (itinerary.length === 0) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    res.json(itinerary[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch Itinerary' });
  }
});
// GET all itineraries
router.get('/generate', async (req, res) => {
  try {

    //filter the events
    const [itineraries] = await pool.query('SELECT * FROM Events Where start_date == 2024-12-15');
    res.json(itineraries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
});
module.exports = router;