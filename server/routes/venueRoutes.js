const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all venues
router.get('/', async (req, res) => {
  try {
    const [venues] = await pool.query('SELECT * FROM Venue');
    res.json(venues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch venues' });
  }
});

// GET single venue
router.get('/:id', async (req, res) => {
  try {
    const [venue] = await pool.query('SELECT * FROM Venue WHERE venue_id = ?', [req.params.id]);
    if (venue.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    res.json(venue[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch venue' });
  }
});

module.exports = router;