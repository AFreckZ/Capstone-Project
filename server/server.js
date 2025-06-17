require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db")

//initailising the routes
const venueRoutes = require('./routes/venueRoutes');
const eventRoutes = require('./routes/eventRoutes');
const touristRoutes = require('./routes/touristRoutes');
const itineraryRoutes= require('./routes/itineraryRoutes');
const transportRoutes = require('./routes/transportRoutes');
const userRoutes = require('./routes/userRoutes');
const preferenceRoutes = require('./routes/preferencesRoutes');
const searchRoutes = require('./routes/search');

//allowing the pictures to be uploaded
app.use('/uploads', express.static('uploads'));
//middleware
app.use(express.json());//Access Body of client
app.use(express.urlencoded({extended: true}));
app.use(cors());

//Routes
//venue routes
app.use('/api/venues', venueRoutes);
//event routes
app.use('/api/events', eventRoutes);
//tourists routes
app.use('/api/tourists', touristRoutes );
//itinerary routes
app.use('/api/itinerary',itineraryRoutes );
//transport agency routes, 
app.use ('/api/transports', transportRoutes);
//user routes 
app.use ('/api/user', userRoutes);
// preference routes
app.use ('/api/prefer', preferenceRoutes);
//search routes
app.use('/api/search',searchRoutes);


//testing the server
app.get('/api/test', (req, res) => {
  res.json({ status: 'Server is working!' });
});

//testing routes
app.get('/api/dbtest', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * From venue');
    res.json({ 
      database: 'Connected', 
      solution: rows[0].solution 
    });
  } catch (err) {
    res.status(500).json({ 
      database: 'Connection failed',
      error: err.message 
    });
  }
});


// Start server
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use`);
    console.log('Try using a different port like 5002, 5050, or 8000');
  }
});