const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pool = require('../db');

router.use(bodyParser.json());

//register user
router.post('/register', async (req, res) => {
  let connection;
  try {
    const { name, email, password, userType } = req.body;

    // Validate input
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    connection = await pool.getConnection();

    // Check if user exists
    const [users] = await connection.query(
      'SELECT id FROM users WHERE email = ?', 
      [email]
    );

    if (users.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const [result] = await connection.query(
      `INSERT INTO users (name, email, password, user_type) 
       VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, userType]
    );

    res.status(201).json({ 
      message: 'User registered successfully',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

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