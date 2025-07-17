const express = require('express');
const router = express.Router();
const { execute } = require('../db'); // Your DB helper function to run queries

// GET all users' latest moods for counselors
router.get('/counselor/moods', async (req, res) => {
  try {
    const result = await execute(`
      SELECT u.id, u.name, u.email, p.mood_today, p.last_mood_logged
      FROM users u
      INNER JOIN user_profiles p ON u.id = p.user_id
      WHERE u.role = 'user'
      ORDER BY p.last_mood_logged DESC
    `);

    res.json({ success: true, moods: result.recordset });
  } catch (error) {
    console.error('Mood fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
