const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db'); // your database connection

// Route for /api/staff/dashboard/stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM workshop_categories) AS totalCategories,
        (SELECT COUNT(*) FROM workshops) AS totalWorkshops,
        (SELECT COUNT(*) FROM workshops WHERE status = 'pending') AS pendingWorkshops,
        (SELECT COUNT(*) FROM workshops WHERE status = 'approved') AS approvedWorkshops,
        (SELECT COUNT(*) FROM workshops WHERE status = 'rejected') AS rejectedWorkshops,
        (SELECT COUNT(*) FROM registrations) AS totalParticipants
    `);

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

module.exports = router;
