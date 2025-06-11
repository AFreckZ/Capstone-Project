import express from 'express';
import sql from '../db.js';

const router = express.Router();

router.post("/save-preferences", async (req, res) => {
    try {
        const { 
            userId, 
            preferences, 
            budget, 
            currency,
            duration, 
            startDate,
            startTime,
            endDate,
            endTime,
            parish,
            accommodation,
            groupSize 
        } = req.body;

        console.log("Saving preferences:", { 
            userId, 
            preferences, 
            budget, 
            currency,
            duration, 
            startDate,
            startTime,
            endDate,
            endTime,
            parish,
            accommodation,
            groupSize 
        });

        
        const newPreference = await sql`
            INSERT INTO user_preferences (
                user_id, 
                preferences, 
                budget, 
                currency,
                duration, 
                start_date,
                start_time,
                end_date,
                end_time,
                parish,
                accommodation,
                group_size,
                created_at
            ) 
            VALUES (
                ${userId || 1}, 
                ${JSON.stringify(preferences)}, 
                ${budget}, 
                ${currency || 'USD'},
                ${duration}, 
                ${startDate},
                ${startTime || '09:00'},
                ${endDate},
                ${endTime || '18:00'},
                ${parish || null},
                ${accommodation || null},
                ${groupSize},
                NOW()
            )
            RETURNING *
        `;

        res.json({
            success: true,
            preference: newPreference[0],
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

        const preferences = await sql`
            SELECT * FROM user_preferences 
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
            LIMIT 1
        `;

        if (preferences.length > 0) {
            res.json(preferences[0]);
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
            preferences, 
            budget, 
            currency,
            duration,
            startDate,
            startTime,
            endDate,
            endTime,
            parish,
            accommodation,
            groupSize 
        } = req.body;

        const updatedPreference = await sql`
            UPDATE user_preferences 
            SET 
                preferences = ${JSON.stringify(preferences)},
                budget = ${budget},
                currency = ${currency},
                duration = ${duration},
                start_date = ${startDate},
                start_time = ${startTime},
                end_date = ${endDate},
                end_time = ${endTime},
                parish = ${parish},
                accommodation = ${accommodation},
                group_size = ${groupSize},
                updated_at = NOW()
            WHERE user_id = ${userId}
            RETURNING *
        `;

        if (updatedPreference.length > 0) {
            res.json({
                success: true,
                preference: updatedPreference[0],
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

        await sql`
            DELETE FROM user_preferences 
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

        const preferences = await sql`
            SELECT * FROM user_preferences 
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
        `;

        res.json({
            success: true,
            preferences: preferences,
            count: preferences.length
        });
    } catch (err) {
        console.error("Error fetching all preferences:", err.message);
        res.status(500).json({ error: "Server error fetching preferences" });
    }
});

export default router;