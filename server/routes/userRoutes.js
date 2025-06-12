const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');


router.use(bodyParser.json());


//register user
router.post('/register', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { name, email, password, userType } = req.body;
    console.log('Registration attempt:', { name, email, userType }); // Debug log

    // Validate input
    if (!name || !email || !password || !userType) {
      throw new Error('All fields are required');
    }

    // Start transaction
    await connection.query('START TRANSACTION');
    console.log('Transaction started'); // Debug log

    // 1. Insert into main users table
    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await connection.query(
      `INSERT INTO user (username, password, email, usertype) 
       VALUES (?, ?, ?, ?)`,
      [name, hashedPassword,email, userType]
    );
    console.log('Main user created:', userResult); // Debug log

    // 2. Insert into type-specific table
    let profileQuery, profileParams;
    switch (userType) {
      case 'tourist':
        profileQuery = `INSERT INTO tourist (user_id) VALUES (?)`;
        profileParams = [userResult.insertId];
        break;
      case 'business-owner':
        profileQuery = `INSERT INTO businessowner (user_id) VALUES (?)`;
        profileParams = [userResult.insertId];
        break;
      case 'transport-agency':
        profileQuery = `INSERT INTO transportagency (user_id) VALUES (?)`;
        profileParams = [userResult.insertId];
        break;
      default:
        throw new Error(`Invalid user type: ${userType}`);
    }

    const [profileResult] = await connection.query(profileQuery, profileParams);
    console.log('Profile created:', profileResult); // Debug log

    // Commit transaction
    await connection.query('COMMIT');
    console.log('Transaction committed'); // Debug log

    res.status(201).json({
      success: true,
      userId: userResult.insertId,
      profileId: profileResult.insertId,
      userType: userType
    });

  } catch (error) {
    // Rollback on error
    await connection.query('ROLLBACK');
    console.error('Registration failed:', error);

    // Specific error handling
    let statusCode = 500;
    let message = 'Registration failed';

    if (error.message.includes('All fields are required')) {
      statusCode = 400;
      message = error.message;
    } else if (error.code === 'ER_DUP_ENTRY') {
      statusCode = 409;
      message = 'Email already exists';
    } else if (error.message.includes('Invalid user type')) {
      statusCode = 400;
      message = error.message;
    }

    res.status(statusCode).json({ 
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
    console.log('Connection released'); // Debug log
  }
});

// login user
router.post('/login', async (req, res) => {
  
  try {
    const { email, password } = req.body;
    console.log('Looking up user with email:', email);
    
    // Test the actual user query
    console.log(' About to execute user lookup query');
    const [rows] = await pool.execute(
      'SELECT * FROM user WHERE email = ?',
      [email]
    );
    
    console.log(' User query completed successfully');
    console.log('Found rows:', rows.length);
    console.log('Row data:', rows);
    
    if (rows.length === 0) {
      console.log(' No user found');
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }
    
    const user = rows[0];
    console.log(' User found:', {
      id: user.user_id,
      email: user.email,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    });
    
    console.log(' About to compare passwords');
    console.log('Input password:', password);
    console.log('Stored password hash (first 20 chars):', user.password.substring(0, 20) + '...');
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison completed');
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Password verification failed');
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }
    
    console.log(' Password verified successfully');
    console.log(' Creating JWT token');
    console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);
    
    const token = jwt.sign(
      { 
        userId: user.user_id, 
        email: user.email, 
        userType: user.usertype
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log(' JWT token created successfully');
    
    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.user_id,
        email: user.email,
        username: user.username || null,
        usertype: user.usertype
      }
    });
    
    console.log('Response sent successfully');
    
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