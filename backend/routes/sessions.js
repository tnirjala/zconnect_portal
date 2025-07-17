const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

// Get all public sessions (approved only)
router.get('/public', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT s.*, c.title AS category_title, u.name AS created_by_name
        FROM counseling_sessions s
        LEFT JOIN workshop_categories c ON s.category_id = c.id
        LEFT JOIN users u ON s.created_by = u.id
        WHERE s.status = 'approved'
        ORDER BY s.date, s.time
      `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching public sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get all sessions (admin view)
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT s.*, c.title AS category_title, u.name AS created_by_name
        FROM counseling_sessions s
        LEFT JOIN workshop_categories c ON s.category_id = c.id
        LEFT JOIN users u ON s.created_by = u.id
        ORDER BY s.created_at DESC
      `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get sessions registered by current user
router.get('/my-sessions', async (req, res) => {
  try {
    const userEmail = req.headers['user-email'];
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.VarChar(255), userEmail)
      .query(`
        SELECT s.*, c.title AS category_title, u.name AS created_by_name
        FROM counseling_sessions s
        LEFT JOIN workshop_categories c ON s.category_id = c.id
        LEFT JOIN users u ON s.created_by = u.id
        INNER JOIN counseling_participants p ON s.id = p.session_id
        WHERE p.email = @email
        ORDER BY s.date, s.time
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({ error: 'Failed to fetch user sessions' });
  }
});

// Get session by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT s.*, c.title AS category_title, u.name AS created_by_name
        FROM counseling_sessions s
        LEFT JOIN workshop_categories c ON s.category_id = c.id
        LEFT JOIN users u ON s.created_by = u.id
        WHERE s.id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Create new session
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      category_id,
      created_by
    } = req.body;

    if (!title || !date || !time || !location || !created_by) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('title', sql.VarChar(255), title)
      .input('description', sql.Text, description || '')
      .input('date', sql.Date, date)
      .input('time', sql.VarChar(50), time)
      .input('location', sql.VarChar(255), location)
      .input('category_id', sql.Int, category_id || null)
      .input('created_by', sql.Int, created_by)
      .input('status', sql.VarChar(20), 'pending')
      .query(`
        INSERT INTO counseling_sessions
          (title, description, date, time, location, category_id, created_by, status)
        OUTPUT INSERTED.*
        VALUES (@title, @description, @date, @time, @location, @category_id, @created_by, @status)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Update session
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      date,
      time,
      location,
      category_id
    } = req.body;

    if (!title || !date || !time || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pool = await poolPromise;
    const currentRes = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT status FROM counseling_sessions WHERE id = @id');

    if (currentRes.recordset.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    let newStatus = currentRes.recordset[0].status;
    if (['rejected', 'approved'].includes(newStatus)) {
      newStatus = 'pending';
    }

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.VarChar(255), title)
      .input('description', sql.Text, description || '')
      .input('date', sql.Date, date)
      .input('time', sql.VarChar(50), time)
      .input('location', sql.VarChar(255), location)
      .input('category_id', sql.Int, category_id || null)
      .input('status', sql.VarChar(20), newStatus)
      .query(`
        UPDATE counseling_sessions
        SET title = @title,
            description = @description,
            date = @date,
            time = @time,
            location = @location,
            category_id = @category_id,
            status = @status,
            updated_at = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Delete session
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    
    // First delete participants to maintain referential integrity
    await pool.request()
      .input('session_id', sql.Int, id)
      .query('DELETE FROM counseling_participants WHERE session_id = @session_id');
    
    // Then delete the session
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM counseling_sessions WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Update session status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid or missing status field' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.VarChar(20), status)
      .query(`
        UPDATE counseling_sessions
        SET status = @status,
            updated_at = GETDATE()
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ message: `Session status updated to ${status}` });
  } catch (error) {
    console.error('Error updating session status:', error);
    res.status(500).json({ error: 'Failed to update session status' });
  }
});

// Register for a session
router.post('/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const pool = await poolPromise;
    const sessionCheck = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT status FROM counseling_sessions WHERE id = @id');

    if (sessionCheck.recordset.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    if (sessionCheck.recordset[0].status !== 'approved') {
      return res.status(400).json({ error: 'Cannot register for this session' });
    }

    const regCheck = await pool.request()
      .input('session_id', sql.Int, id)
      .input('email', sql.VarChar(255), email)
      .query('SELECT id FROM counseling_participants WHERE session_id = @session_id AND email = @email');

    if (regCheck.recordset.length > 0) {
      return res.status(400).json({ error: 'Already registered for this session' });
    }

    await pool.request()
      .input('session_id', sql.Int, id)
      .input('name', sql.VarChar(255), name)
      .input('email', sql.VarChar(255), email)
      .query(`
        INSERT INTO counseling_participants
        (session_id, name, email)
        VALUES (@session_id, @name, @email)
      `);

    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering participant:', error);
    res.status(500).json({ error: 'Failed to register participant' });
  }
});

// Cancel registration
router.delete('/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.headers['user-email'];
    
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('session_id', sql.Int, id)
      .input('email', sql.VarChar(255), userEmail)
      .query('DELETE FROM counseling_participants WHERE session_id = @session_id AND email = @email');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling registration:', error);
    res.status(500).json({ error: 'Failed to cancel registration' });
  }
});

// Get participants for a session (admin/counselor view)
router.get('/:id/participants', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('session_id', sql.Int, id)
      .query('SELECT * FROM counseling_participants WHERE session_id = @session_id');

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

// Admin/Counselor cancel a specific user's registration
router.delete('/:sessionId/participants/:email', async (req, res) => {
  try {
    const { sessionId, email } = req.params;

    if (!email) {
      return res.status(400).json({ error: 'Email is required to cancel registration' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('session_id', sql.Int, sessionId)
      .input('email', sql.VarChar(255), email)
      .query(`
        DELETE FROM counseling_participants 
        WHERE session_id = @session_id AND email = @email
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Registration not found for this user' });
    }

    res.json({ message: `Registration for ${email} cancelled successfully.` });
  } catch (error) {
    console.error('Error cancelling user registration:', error);
    res.status(500).json({ error: 'Failed to cancel registration' });
  }
});


module.exports = router;