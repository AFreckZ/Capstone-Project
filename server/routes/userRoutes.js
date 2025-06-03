const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pool = require('../db');
const bcrypt = require('bcrypt');

router.use(bodyParser.json());

//register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    // Validation (same as before)
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const [users] = await pool.query('SELECT user_id FROM user WHERE email = ?', [email]);
    if (users.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password and insert
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO user (username, password, email, usertype) VALUES (?, ?, ?, ?)',
      [name, hashedPassword, email, userType]
    );

    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertId,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Getting all the users
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