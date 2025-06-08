const express = require('express');
const router = express.Router();
const pool = require('../db');

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

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const [tourist] = await pool.query('SELECT * FROM Tourist WHERE tourist_id = ?', [req.params.id]);
    if (tourist.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(tourist[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

module.exports = router;