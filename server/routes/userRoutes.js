const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');


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

// login user
router.post('/login', async (req, res) => {
  console.log('=== USER LOOKUP DEBUG ===');
  
  try {
    const { email, password } = req.body;
    console.log('Looking up user with email:', email);
    
    // Test the actual user query
    console.log('Step 10: About to execute user lookup query');
    const [rows] = await pool.execute(
      'SELECT * FROM user WHERE email = ?',
      [email]
    );
    
    console.log('Step 11: User query completed successfully');
    console.log('Found rows:', rows.length);
    console.log('Row data:', rows);
    
    if (rows.length === 0) {
      console.log('Step 12: No user found');
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }
    
    const user = rows[0];
    console.log('Step 12: User found:', {
      id: user.user_id,
      email: user.email,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    });
    
    console.log('Step 13: About to compare passwords');
    console.log('Input password:', password);
    console.log('Stored password hash (first 20 chars):', user.password.substring(0, 20) + '...');
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Step 14: Password comparison completed');
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Step 15: Password verification failed');
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }
    
    console.log('Step 15: Password verified successfully');
    console.log('Step 16: Creating JWT token');
    console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);
    
    const token = jwt.sign(
      { 
        userId: user.user_id, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('Step 17: JWT token created successfully');
    
    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.user_id,
        email: user.email,
        username: user.username || null
      }
    });
    
    console.log('Step 18: Response sent successfully');
    
  } catch (error) {
    console.log('=== ERROR IN USER LOOKUP ===');
    console.log('Error message:', error.message);
    console.log('Error code:', error.code);
    console.log('Full error:', error);
    
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message
    });
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

// GET single user
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