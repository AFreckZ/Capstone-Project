const express = require('express');
const router = express.Router();
const pool = require('../db');

//register event
// router.post('/regevent', async (req, res) =>{
//     try{
//         const {}= req.body;
//         const [result] = await pool.query('INSERT INTO Event ()')
//     }
// } );


// GET all events
router.get('/', async (req, res) => {
  try {
    const [events] = await pool.query('SELECT * FROM Event');
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const [event] = await pool.query('SELECT * FROM Event WHERE event_id = ?', [req.params.id]);
    if (event.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

module.exports = router;