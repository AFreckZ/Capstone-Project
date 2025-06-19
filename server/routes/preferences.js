import express from 'express';
import sql from '../db.js';

const router = express.Router();

router.post("/save-preferences", async (req, res) => {
    try {
        const { 
            tripData,
            weightedPreferences
        } = req.body;

        const {
            userId,
            budget,
            startDate,
            endDate,
            preferredStartTime,
            preferredEndTime,
            accommodation,
            preferredDays,
            needTransportation
        } = tripData;

        console.log("Saving preferences:", { 
            userId,
            budget,
            startDate,
            endDate,
            preferredStartTime,
            preferredEndTime,
            accommodation,
            preferredDays,
            needTransportation: needTransportation ? 1 : 0,
            weightedPreferences
        });

        // Insert into tourists table
        const newTourist = await sql`
            INSERT INTO tourist (
                user_id, 
                trip_start,
                trip_end,
                budget,
                need_for_transport,
                preferred_start,
                preferred_end,
                address,
                preferred_dates
            ) 
            VALUES (
                ${userId}, 
                ${startDate},
                ${endDate},
                ${budget},
                ${needTransportation ? 1 : 0},
                ${preferredStartTime || '09:00:00'},
                ${preferredEndTime || '17:00:00'},
                ${accommodation || null},
                ${JSON.stringify(preferredDays || [])}
            )
            RETURNING *
        `;

        const touristId = newTourist[0].tourist_id;

        // Insert preferences into tourist_preferences table
        const newPreferences = await sql`
            INSERT INTO tourist_preferences (
                tourist_id,
                preferences,
                created_at,
                updated_at
            )
            VALUES (
                ${touristId},
                ${JSON.stringify(weightedPreferences)},
                NOW(),
                NOW()
            )
            RETURNING *
        `;

        res.json({
            success: true,
            tourist: newTourist[0],
            preferences: newPreferences[0],
            message: "Preferences saved successfully"
        });
    } catch (err) {
        console.error("Error saving preferences:", err.message);
        res.status(500).json({ error: "Server error saving preferences" });
    }
});

router.get("/get-preferences/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const touristData = await sql`
            SELECT t.*, tp.preferences 
            FROM tourists t
            LEFT JOIN tourist_preferences tp ON t.tourist_id = tp.tourist_id
            WHERE t.user_id = ${userId}
            ORDER BY t.tourist_id DESC
            LIMIT 1
        `;

        if (touristData.length > 0) {
            const tourist = touristData[0];
            // Parse JSON fields before sending response
            if (tourist.preferred_dates) {
                tourist.preferred_dates = JSON.parse(tourist.preferred_dates);
            }
            if (tourist.preferences) {
                tourist.preferences = JSON.parse(tourist.preferences);
            }
            res.json(tourist);
        } else {
            res.status(404).json({ message: "No preferences found" });
        }
    } catch (err) {
        console.error("Error fetching preferences:", err.message);
        res.status(500).json({ error: "Server error fetching preferences" });
    }
});

router.put("/update-preferences/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { 
            tripData,
            weightedPreferences
        } = req.body;

        const {
            budget,
            startDate,
            endDate,
            preferredStartTime,
            preferredEndTime,
            accommodation,
            preferredDays,
            needTransportation
        } = tripData;

        // Update tourists table
        const updatedTourist = await sql`
            UPDATE tourists 
            SET 
                trip_start = ${startDate},
                trip_end = ${endDate},
                budget = ${budget},
                need_for_transport = ${needTransportation ? 1 : 0},
                preferred_start = ${preferredStartTime || '09:00:00'},
                preferred_end = ${preferredEndTime || '17:00:00'},
                address = ${accommodation},
                preferred_dates = ${JSON.stringify(preferredDays || [])}
            WHERE user_id = ${userId}
            RETURNING *
        `;

        if (updatedTourist.length > 0) {
            const touristId = updatedTourist[0].tourist_id;
            
            // Update tourist_preferences table
            const updatedPreferences = await sql`
                UPDATE tourist_preferences 
                SET 
                    preferences = ${JSON.stringify(weightedPreferences)},
                    updated_at = NOW()
                WHERE tourist_id = ${touristId}
                RETURNING *
            `;

            // Parse JSON fields before sending response
            const tourist = updatedTourist[0];
            if (tourist.preferred_dates) {
                tourist.preferred_dates = JSON.parse(tourist.preferred_dates);
            }
            
            res.json({
                success: true,
                tourist: tourist,
                preferences: updatedPreferences[0] ? JSON.parse(updatedPreferences[0].preferences) : null,
                message: "Preferences updated successfully"
            });
        } else {
            res.status(404).json({ message: "No preferences found to update" });
        }
    } catch (err) {
        console.error("Error updating preferences:", err.message);
        res.status(500).json({ error: "Server error updating preferences" });
    }
});

router.delete("/delete-preferences/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Delete from both tables (foreign key constraints should handle this)
        await sql`
            DELETE FROM tourists 
            WHERE user_id = ${userId}
        `;

        res.json({
            success: true,
            message: "Preferences deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting preferences:", err.message);
        res.status(500).json({ error: "Server error deleting preferences" });
    }
});

//Get all preferences for a user 
router.get("/get-all-preferences/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const touristData = await sql`
            SELECT t.*, tp.preferences 
            FROM tourists t
            LEFT JOIN tourist_preferences tp ON t.tourist_id = tp.tourist_id
            WHERE t.user_id = ${userId}
            ORDER BY t.tourist_id DESC
        `;

        // Parse JSON fields for all preferences
        const parsedTouristData = touristData.map(tourist => {
            if (tourist.preferred_dates) {
                tourist.preferred_dates = JSON.parse(tourist.preferred_dates);
            }
            if (tourist.preferences) {
                tourist.preferences = JSON.parse(tourist.preferences);
            }
            return tourist;
        });

        res.json({
            success: true,
            preferences: parsedTouristData,
            count: parsedTouristData.length
        });
    } catch (err) {
        console.error("Error fetching all preferences:", err.message);
        res.status(500).json({ error: "Server error fetching preferences" });
    }
});

router.get("/get-preferences-by-day/:userId/:day", async (req, res) => {
    try {
        const { userId, day } = req.params;

        const touristData = await sql`
            SELECT t.*, tp.preferences 
            FROM tourists t
            LEFT JOIN tourist_preferences tp ON t.tourist_id = tp.tourist_id
            WHERE t.user_id = ${userId}
            AND t.preferred_dates::jsonb ? ${day}
            ORDER BY t.tourist_id DESC
        `;

        const parsedTouristData = touristData.map(tourist => {
            if (tourist.preferred_dates) {
                tourist.preferred_dates = JSON.parse(tourist.preferred_dates);
            }
            if (tourist.preferences) {
                tourist.preferences = JSON.parse(tourist.preferences);
            }
            return tourist;
        });

        res.json({
            success: true,
            preferences: parsedTouristData,
            count: parsedTouristData.length,
            day: day
        });
    } catch (err) {
        console.error("Error fetching preferences by day:", err.message);
        res.status(500).json({ error: "Server error fetching preferences by day" });
    }
});

export default router;