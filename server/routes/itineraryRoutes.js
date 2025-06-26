// const express = require('express');
// const router = express.Router();
// const pool = require('../db');

// // GET all itineraries
// router.get('/', async (req, res) => {
//   try {
//     const [itineraries] = await pool.query('SELECT * FROM itineraries');
//     res.json(itineraries);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch itinerary' });
//   }
// });

// // GET single intinerary
// router.get('/:id', async (req, res) => {
//   try {
//     const [itinerary] = await pool.query('SELECT * FROM itineraries WHERE itinerary_id = ?', [req.params.id]);
//     if (itinerary.length === 0) {
//       return res.status(404).json({ error: 'Itinerary not found' });
//     }
//     res.json(itinerary[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch Itinerary' });
//   }
// });
// // GET all itineraries
// // router.get('/generate', async (req, res) => {
// //   try {

// //     //filter the events
// //     const [itineraries] = await pool.query('SELECT * FROM Events Where start_date == 2024-12-15');
// //     res.json(itineraries);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Failed to fetch itinerary' });
// //   }
// //});
// module.exports = router;
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET all itineraries for a user
router.get('/', auth, async (req, res) => {
  try {
    const [itineraries] = await pool.query(
      'SELECT * FROM itineraries WHERE user_id = ?', 
      [req.user.id]
    );
    
    // Parse JSON fields
    const parsedItineraries = itineraries.map(it => ({
      ...it,
      trip_data: JSON.parse(it.trip_data),
      preferences: JSON.parse(it.preferences || '[]'),
      activities: JSON.parse(it.activities || '[]'),
      route_data: JSON.parse(it.route_data || '[]')
    }));
    
    res.json(parsedItineraries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch itineraries' });
  }
});

// GET single itinerary
router.get('/:id', auth, async (req, res) => {
  try {
    const [itinerary] = await pool.query(
      'SELECT * FROM itineraries WHERE id = ? AND user_id = ?', 
      [req.params.id, req.user.id]
    );
    
    if (itinerary.length === 0) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    
    // Parse JSON fields
    const parsedItinerary = {
      ...itinerary[0],
      trip_data: JSON.parse(itinerary[0].trip_data),
      preferences: JSON.parse(itinerary[0].preferences || '[]'),
      activities: JSON.parse(itinerary[0].activities || '[]'),
      route_data: JSON.parse(itinerary[0].route_data || '[]')
    };
    
    // Update last viewed timestamp
    await pool.query(
      'UPDATE itineraries SET last_viewed_at = CURRENT_TIMESTAMP WHERE id = ?',
      [req.params.id]
    );
    
    res.json(parsedItinerary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
});

// POST create new itinerary
router.post('/', auth, async (req, res) => {
  try {
    const {
      itineraryName,
      tripData,
      preferences,
      activities,
      summary,
      routeData,
      isDefault = false
    } = req.body;

    // If setting as default, unset all other defaults for this user
    if (isDefault) {
      await pool.query(
        'UPDATE itineraries SET is_default = FALSE WHERE user_id = ?',
        [req.user.id]
      );
    }

    // Insert new itinerary
    const [result] = await pool.query(
      `INSERT INTO itineraries (
        user_id, 
        itinerary_name, 
        trip_data, 
        preferences, 
        activities,
        total_cost,
        total_activities,
        total_days,
        budget_remaining,
        route_data,
        is_default,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        req.user.id,
        itineraryName || `Trip to Jamaica - ${new Date().toLocaleDateString()}`,
        JSON.stringify(tripData),
        JSON.stringify(preferences),
        JSON.stringify(activities),
        summary?.totalCost || 0,
        summary?.totalActivities || 0,
        summary?.totalDays || 0,
        summary?.budgetRemaining || 0,
        JSON.stringify(routeData || []),
        isDefault
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Itinerary created successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create itinerary' });
  }
});

// PUT update itinerary
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      itineraryName,
      tripData,
      preferences,
      activities,
      summary,
      routeData,
      status,
      isDefault
    } = req.body;

    // If setting as default, unset all other defaults for this user
    if (isDefault) {
      await pool.query(
        'UPDATE itineraries SET is_default = FALSE WHERE user_id = ? AND id != ?',
        [req.user.id, req.params.id]
      );
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (itineraryName !== undefined) {
      updateFields.push('itinerary_name = ?');
      updateValues.push(itineraryName);
    }

    if (tripData !== undefined) {
      updateFields.push('trip_data = ?');
      updateValues.push(JSON.stringify(tripData));
    }

    if (preferences !== undefined) {
      updateFields.push('preferences = ?');
      updateValues.push(JSON.stringify(preferences));
    }

    if (activities !== undefined) {
      updateFields.push('activities = ?');
      updateValues.push(JSON.stringify(activities));
    }

    if (summary !== undefined) {
      if (summary.totalCost !== undefined) {
        updateFields.push('total_cost = ?');
        updateValues.push(summary.totalCost);
      }
      if (summary.totalActivities !== undefined) {
        updateFields.push('total_activities = ?');
        updateValues.push(summary.totalActivities);
      }
      if (summary.totalDays !== undefined) {
        updateFields.push('total_days = ?');
        updateValues.push(summary.totalDays);
      }
      if (summary.budgetRemaining !== undefined) {
        updateFields.push('budget_remaining = ?');
        updateValues.push(summary.budgetRemaining);
      }
    }

    if (routeData !== undefined) {
      updateFields.push('route_data = ?');
      updateValues.push(JSON.stringify(routeData));
    }

    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (isDefault !== undefined) {
      updateFields.push('is_default = ?');
      updateValues.push(isDefault);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');

    // Only proceed if there are fields to update
    if (updateFields.length > 1) {
      updateValues.push(req.params.id, req.user.id);
      
      const [result] = await pool.query(
        `UPDATE itineraries 
        SET ${updateFields.join(', ')} 
        WHERE id = ? AND user_id = ?`,
        updateValues
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Itinerary not found' });
      }
    }

    res.json({ message: 'Itinerary updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update itinerary' });
  }
});

// DELETE itinerary
router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM itineraries WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    res.json({ message: 'Itinerary deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete itinerary' });
  }
});

// PATCH set default itinerary
router.patch('/:id/set-default', auth, async (req, res) => {
  try {
    // First unset all defaults for this user
    await pool.query(
      'UPDATE itineraries SET is_default = FALSE WHERE user_id = ?',
      [req.user.id]
    );

    // Then set the specified itinerary as default
    const [result] = await pool.query(
      'UPDATE itineraries SET is_default = TRUE WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    res.json({ message: 'Default itinerary set successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to set default itinerary' });
  }
});

module.exports = router;