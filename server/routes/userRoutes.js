const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all Users
router.get('/', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM User');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const [user] = await pool.query('SELECT * FROM User WHERE user_id = ?', [req.params.id]);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;