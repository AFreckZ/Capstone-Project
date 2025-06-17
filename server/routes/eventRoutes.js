// const express = require('express');
// const router = express.Router();
// const pool = require('../db');



// // GET all events
// router.get('/', async (req, res) => {
//   try {
//     const [events] = await pool.query('SELECT * FROM Event');
//     res.json(events);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch events' });
//   }
// });

// // GET single event
// router.get('/:id', async (req, res) => {
//   try {
//     const [event] = await pool.query('SELECT * FROM Event WHERE event_id = ?', [req.params.id]);
//     if (event.length === 0) {
//       return res.status(404).json({ error: 'Event not found' });
//     }
//     res.json(event[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch event' });
//   }
// });

// module.exports = router;
// routes/events.js - Fixed version with file upload support
const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads/events/';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF) and documents (PDF, DOC, DOCX) are allowed.'));
    }
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// POST /api/events/upload - Handle file uploads
router.post('/upload', authenticateToken, upload.fields([
  { name: 'menuImage', maxCount: 1 },
  { name: 'flyerImage', maxCount: 1 },
 
]), async (req, res) => {
  try {
    console.log('File upload request received');
    console.log('Files:', req.files);
    
    const uploadedFiles = {};
    
    if (req.files.menuImage) {
      uploadedFiles.menu_image_path = `/uploads/events/${req.files.menuImage[0].filename}`;
      console.log('Menu image uploaded:', uploadedFiles.menu_image_path);
    }
    
    if (req.files.flyerImage) {
      uploadedFiles.flyer_image_path = `/uploads/events/${req.files.flyerImage[0].filename}`;
      console.log('Flyer image uploaded:', uploadedFiles.flyer_image_path);
    }
    
    
    
    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
    
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload files',
      details: error.message 
    });
  }
});

// Helper function to create events (single day or multi-day) WITH FILE PATHS
const createEvents = async (connection, eventData, eventSchedule, bid) => {
  const createdEvents = [];
  
  for (const schedule of eventSchedule) {
    let startDateTime, endDateTime;
    
    if (schedule.isMultiDay) {
      startDateTime = new Date(`${schedule.startDate}T${schedule.startTime}`);
      endDateTime = new Date(`${schedule.endDate}T${schedule.endTime}`);
    } else {
      startDateTime = new Date(`${schedule.date}T${schedule.startTime}`);
      endDateTime = new Date(`${schedule.date}T${schedule.endTime}`);
    }
    
    if (startDateTime >= endDateTime) {
      throw new Error(`Invalid event schedule: end time must be after start time`);
    }
    
    // INSERT WITH CORRECT PARAMETER COUNT (10 columns = 10 parameters)
    console.log('=== DEBUG: SQL INSERT PARAMETERS ===');
    console.log('Columns (10):', 'bid, name, event_type, start_datetime, end_datetime, venue_location, cost, description, menu_image_path, flyer_image_path');
    
    const parameters = [
      bid,                                    // 1
      eventData.name,                        // 2
      eventData.event_type,                  // 3
      startDateTime,                         // 4
      endDateTime,                           // 5
      eventData.venue_location,              // 6
      eventData.cost,                        // 7
      eventData.description,                 // 8
      eventData.menu_image_path,             // 9
      eventData.flyer_image_path             // 10
      // REMOVED: eventData.itinerary_file_path - this was the extra parameter!
    ];
    
    console.log('Parameters (10):', parameters);
    console.log('Parameter count:', parameters.length);
    
    const [result] = await connection.query(`
      INSERT INTO event (
        bid, name, event_type, start_datetime, end_datetime, 
        venue_location, cost, description, menu_image_path, flyer_image_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, parameters);
    
    console.log('=== SQL INSERT SUCCESS ===');
    
    createdEvents.push({
      event_id: result.insertId,
      ...eventData,
      start_datetime: startDateTime,
      end_datetime: endDateTime,
      schedule: schedule,
      duration_days: schedule.isMultiDay ? 
        Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24)) : 1
    });
  }
  
  return createdEvents;
};
// POST /api/events/create - Create new event(s) WITH FILE SUPPORT
router.post('/create', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const {
      name,
      eventType,
      address, 
      description,
      cost,
      dateSchedule, // Array of schedule objects (single day or multi-day)
      menu_image_path,
      flyer_image_path,
    } = req.body;
    
    const authenticated_user_id = req.user.userId;
    
    console.log('=== EVENT CREATION REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Authenticated user ID:', authenticated_user_id);
    console.log('Date schedule:', dateSchedule);
    console.log('File paths:', { menu_image_path, flyer_image_path });
    console.log('=== END REQUEST DATA ===');

    // Validate required fields
    if (!name || !eventType || !address) {
      return res.status(400).json({ 
        error: 'Name, event type, and venue location are required' 
      });
    }

    // Validate dateSchedule (can be single day or multi-day events)
    if (!dateSchedule || !Array.isArray(dateSchedule) || dateSchedule.length === 0) {
      return res.status(400).json({ 
        error: 'At least one event schedule is required' 
      });
    }

    // Validate each schedule item
    for (let i = 0; i < dateSchedule.length; i++) {
      const schedule = dateSchedule[i];
      
      if (schedule.isMultiDay) {
        if (!schedule.startDate || !schedule.endDate || !schedule.startTime || !schedule.endTime) {
          return res.status(400).json({ 
            error: `Multi-day event schedule ${i + 1} is missing required fields` 
          });
        }
        
        // Validate that end date is after start date
        if (new Date(schedule.endDate) <= new Date(schedule.startDate)) {
          return res.status(400).json({ 
            error: `Multi-day event schedule ${i + 1}: end date must be after start date` 
          });
        }
      } else {
        if (!schedule.date || !schedule.startTime || !schedule.endTime) {
          return res.status(400).json({ 
            error: `Single-day event schedule ${i + 1} is missing required fields` 
          });
        }
      }
    }

    // Validate event type against database enum
    const validEventTypes = ['Concert', 'Party', 'Festival', 'Sport', 'Art/Talent Showcasing'];
    if (!validEventTypes.includes(eventType)) {
      return res.status(400).json({ 
        error: `Invalid event type. Must be one of: ${validEventTypes.join(', ')}` 
      });
    }

    // Get the user's business ID (bid) from business_owner table
    const [businessOwnerRecord] = await connection.query('SELECT bid FROM businessowner WHERE user_id = ?', [authenticated_user_id]);
    
    let bid;
    if (businessOwnerRecord.length > 0 && businessOwnerRecord[0].bid) {
      bid = businessOwnerRecord[0].bid;
      console.log('Found bid for user:', { user_id: authenticated_user_id, bid });
    } else {
      return res.status(400).json({ 
        error: 'No business found for this user. Please ensure you are registered as a business owner before creating events.' 
      });
    }

    await connection.query('START TRANSACTION');

    // Prepare event data WITH FILE PATHS
    const eventData = {
      name: name.trim(),
      event_type: eventType,
      venue_location: address.trim(),
      cost: cost ? parseFloat(cost) : null,
      description: description ? description.trim() : null,
      menu_image_path: menu_image_path || null,
      flyer_image_path: flyer_image_path || null,
    };

    console.log('Prepared event data:', eventData);

    // Create events for each schedule (single day or multi-day)
    const createdEvents = await createEvents(connection, eventData, dateSchedule, bid);

    await connection.query('COMMIT');

    console.log('Created events:', createdEvents.length);

    // Return success response
    res.status(201).json({
      message: `${createdEvents.length} event(s) created successfully`,
      events: createdEvents,
      bid: bid,
      user_id: authenticated_user_id,
      total_events: createdEvents.length
    });

    console.log('=== EVENT CREATION SUCCESS ===');

  } catch (error) {
    await connection.query('ROLLBACK');
    console.error('=== EVENT CREATION ERROR ===');
    console.error('DB error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    // Handle specific database errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        error: 'An event with this name already exists for this time slot' 
      });
    }
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ 
        error: 'Events table not found. Please ensure table exists.' 
      });
    }

    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({ 
        error: 'Database column error. Please check table structure.' 
      });
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ 
        error: 'Invalid user/business ID.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create event(s)',
      details: error.message 
    });
  } finally {
    connection.release();
  }
});

// GET all events (with file paths)
router.get('/', async (req, res) => {
  try {
    const [events] = await pool.query(`
      SELECT 
        e.*,
        bo.business_name
      FROM event e
      LEFT JOIN businessowner bo ON e.bid = bo.bid
      ORDER BY e.start_datetime ASC
    `);
    
    res.json({
      events: events,
      total: events.length
    });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET single event (with file paths)
router.get('/:id', async (req, res) => {
  try {
    const [event] = await pool.query(`
      SELECT 
        e.*,
        bo.business_name
      FROM event e
      LEFT JOIN businessowner bo ON e.bid = bo.bid
      WHERE e.event_id = ?
    `, [req.params.id]);
    
    if (event.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event[0]);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// GET events for authenticated user (with file paths)
router.get('/user/my-events', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;

    // Get the user's bid from business_owner table
    const [businessOwnerRecord] = await pool.query('SELECT bid FROM businessowner WHERE user_id = ?', [user_id]);
    
    if (businessOwnerRecord.length === 0) {
      return res.status(404).json({ 
        error: 'No business found for this user',
        events: [],
        total: 0
      });
    }

    const bid = businessOwnerRecord[0].bid;

    const [events] = await pool.query(`
      SELECT 
        e.*,
        bo.business_name
      FROM event e
      LEFT JOIN businessowner bo ON e.bid = bo.bid
      WHERE e.bid = ?
      ORDER BY e.start_datetime ASC
    `, [bid]);

    res.json({
      events: events,
      total: events.length,
      user_id: user_id,
      bid: bid
    });

  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user events',
      details: error.message 
    });
  }
});

// Test endpoint to check business owner record
router.get('/test/business-owner', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;
    
    console.log('Checking business_owner table for user_id:', user_id);
    
    const [businessOwnerRecord] = await pool.query('SELECT * FROM businessowner WHERE user_id = ?', [user_id]);
    
    if (businessOwnerRecord.length > 0) {
      res.json({ 
        message: 'Business owner record found',
        user_id: user_id,
        business_owner_data: businessOwnerRecord[0]
      });
    } else {
      res.status(404).json({ 
        message: 'No business owner record found for this user',
        user_id: user_id,
        suggestion: 'User needs to be registered as a business owner first'
      });
    }
    
  } catch (error) {
    console.error('Business owner test error:', error);
    res.status(500).json({ 
      error: 'Failed to check business owner table',
      details: error.message 
    });
  }
});

module.exports = router;