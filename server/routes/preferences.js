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
            groupSize,
            preferredDays  // NEW: Added preferredDays
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
            groupSize,
            preferredDays  // NEW: Added preferredDays to console log
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
                preferred_days,  -- NEW: Added preferred_days column
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
                ${JSON.stringify(preferredDays || [])},  -- NEW: Store preferredDays as JSON
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
            // NEW: Parse JSON fields before sending response
            const preference = preferences[0];
            if (preference.preferences) {
                preference.preferences = JSON.parse(preference.preferences);
            }
            if (preference.preferred_days) {
                preference.preferred_days = JSON.parse(preference.preferred_days);
            }
            res.json(preference);
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
            groupSize,
            preferredDays  // NEW: Added preferredDays
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
                preferred_days = ${JSON.stringify(preferredDays || [])},  -- NEW: Added preferred_days update
                updated_at = NOW()
            WHERE user_id = ${userId}
            RETURNING *
        `;

        if (updatedPreference.length > 0) {
            // NEW: Parse JSON fields before sending response
            const preference = updatedPreference[0];
            if (preference.preferences) {
                preference.preferences = JSON.parse(preference.preferences);
            }
            if (preference.preferred_days) {
                preference.preferred_days = JSON.parse(preference.preferred_days);
            }
            
            res.json({
                success: true,
                preference: preference,
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

        // NEW: Parse JSON fields for all preferences
        const parsedPreferences = preferences.map(preference => {
            if (preference.preferences) {
                preference.preferences = JSON.parse(preference.preferences);
            }
            if (preference.preferred_days) {
                preference.preferred_days = JSON.parse(preference.preferred_days);
            }
            return preference;
        });

        res.json({
            success: true,
            preferences: parsedPreferences,
            count: parsedPreferences.length
        });
    } catch (err) {
        console.error("Error fetching all preferences:", err.message);
        res.status(500).json({ error: "Server error fetching preferences" });
    }
});

// NEW: Additional route to get preferences with day filtering
router.get("/get-preferences-by-day/:userId/:day", async (req, res) => {
    try {
        const { userId, day } = req.params;

        const preferences = await sql`
            SELECT * FROM user_preferences 
            WHERE user_id = ${userId}
            AND preferred_days::jsonb ? ${day}
            ORDER BY created_at DESC
        `;

        const parsedPreferences = preferences.map(preference => {
            if (preference.preferences) {
                preference.preferences = JSON.parse(preference.preferences);
            }
            if (preference.preferred_days) {
                preference.preferred_days = JSON.parse(preference.preferred_days);
            }
            return preference;
        });

        res.json({
            success: true,
            preferences: parsedPreferences,
            count: parsedPreferences.length,
            day: day
        });
    } catch (err) {
        console.error("Error fetching preferences by day:", err.message);
        res.status(500).json({ error: "Server error fetching preferences by day" });
    }
});

export default router;