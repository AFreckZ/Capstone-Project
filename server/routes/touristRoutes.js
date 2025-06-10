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

// GET single tourist
router.get('/:id', async (req, res) => {
  try {
    const [tourist] = await pool.query('SELECT * FROM Tourist WHERE tourist_id = ?', [req.params.id]);
    if (tourist.length === 0) {
      return res.status(404).json({ error: 'Tourist not found' });
    }
    res.json(tourist[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tourist' });
  }
});


//getting the tourists budget
router.get('/:id/budget', async (req,res)=>{
  try{
    const[bud] = await pool.query('Select budget From tourist where tourist_id= ?',[ req.params.id]);
    if (bud.length === 0) {
      return res.status(404).json({ error: 'Tourist not found' });
    }
    res.json(bud[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tourist' });
  }
})
//getting the tourists preferred time slots
router.get('/:id/time', async (req,res)=>{
  try{
    const[time] = await pool.query('Select preferred_start, preferred_end From tourist where tourist_id= ?',[ req.params.id]);
    if (time.length === 0) {
      return res.status(404).json({ error: 'Tourist not found' });
    }
    res.json(time[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tourist' });
  }
})


// entering tourist information
// router.post ('/info', async (res,req) =>{
//   try{

//   }
// })
module.exports = router;