const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all drivers
router.get('/', async (req, res) => {
  try {
    const [events] = await pool.query('SELECT * FROM Driver');
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// GET single driver
router.get('/:id', async (req, res) => {
  try {
    const [event] = await pool.query('SELECT * FROM Driver WHERE driver_id = ?', [req.params.id]);
    if (event.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
});