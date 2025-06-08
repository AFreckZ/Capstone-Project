const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all travel agency
router.get('/', async (req, res) => {
  try {
    const [transports] = await pool.query('SELECT * FROM TransportAgency');
    res.json(transports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch TransportAgency' });
  }
});

// GET single travel agency by id
router.get('/:id', async (req, res) => {
  try {
    const [transport] = await pool.query('SELECT * FROM TransportAgency WHERE agency_id = ?', [req.params.id]);
    if (transport.length === 0) {
      return res.status(404).json({ error: 'Agency not found' });
    }
    res.json(transport[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch agency' });
  }
});


module.exports = router;