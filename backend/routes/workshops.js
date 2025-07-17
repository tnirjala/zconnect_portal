const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

// Middleware to get user id from header
const getCreatedBy = (req) => parseInt(req.headers['staff-id'], 10);
const getUserId = (req) => parseInt(req.headers['user-id'], 10);

// ✅ Get all workshops
router.get('/', async (req, res) => {
  try {
    console.log('Fetching workshops...'); // Debug log
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT w.*, wc.title as category_name
        FROM workshops w
        LEFT JOIN workshop_categories wc ON w.category_id = wc.id
        ORDER BY w.created_at DESC
      `);
    
    
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching workshops:', error);
    res.status(500).json({ error: 'Failed to fetch workshops' });
  }
});

// ✅ Get approved workshops for user registration
router.get('/approved', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT w.*, wc.title as category_name,
               (SELECT COUNT(*) FROM registrations r WHERE r.workshop_id = w.id) as registered_count
        FROM workshops w
        LEFT JOIN workshop_categories wc ON w.category_id = wc.id
        WHERE w.status = 'approved' AND w.date >= CAST(GETDATE() AS DATE)
        ORDER BY w.date ASC, w.time ASC
      `);
    
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching approved workshops:', error);
    res.status(500).json({ error: 'Failed to fetch approved workshops' });
  }
});

// ✅ Get user's registered workshops
router.get('/my-workshops', async (req, res) => {
  try {
    const userEmail = req.headers['user-email'];
    
    if (!userEmail) {
      return res.status(400).json({ error: 'User email required' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('userEmail', sql.VarChar(255), userEmail)
      .query(`
        SELECT w.*, wc.title as category_name, r.registered_at,
               (SELECT COUNT(*) FROM registrations r2 WHERE r2.workshop_id = w.id) as registered_count
        FROM workshops w
        LEFT JOIN workshop_categories wc ON w.category_id = wc.id
        INNER JOIN registrations r ON w.id = r.workshop_id
        WHERE r.email = @userEmail
        ORDER BY w.date ASC, w.time ASC
      `);
    
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching user workshops:', error);
    res.status(500).json({ error: 'Failed to fetch user workshops' });
  }
});

// ✅ Register for a workshop
router.post('/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const pool = await poolPromise;

    // Check if workshop exists and is approved
    const workshopResult = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT * FROM workshops 
        WHERE id = @id AND status = 'approved' AND date >= CAST(GETDATE() AS DATE)
      `);

    if (workshopResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Workshop not found or not available for registration' });
    }

    const workshop = workshopResult.recordset[0];

    // Check current registration count
    const countResult = await pool.request()
      .input('workshopId', sql.Int, id)
      .query('SELECT COUNT(*) as count FROM registrations WHERE workshop_id = @workshopId');

    const currentCount = countResult.recordset[0].count;

    if (currentCount >= workshop.capacity) {
      return res.status(400).json({ error: 'Workshop is fully booked' });
    }

    // Check if user is already registered
    const existingResult = await pool.request()
      .input('workshopId', sql.Int, id)
      .input('email', sql.VarChar(255), email)
      .query('SELECT * FROM registrations WHERE workshop_id = @workshopId AND email = @email');

    if (existingResult.recordset.length > 0) {
      return res.status(400).json({ error: 'You are already registered for this workshop' });
    }

    // Register the user
    const result = await pool.request()
      .input('workshopId', sql.Int, id)
      .input('name', sql.VarChar(255), name)
      .input('email', sql.VarChar(255), email)
      .query(`
        INSERT INTO registrations (workshop_id, name, email)
        OUTPUT INSERTED.*
        VALUES (@workshopId, @name, @email)
      `);

    res.status(201).json({
      message: 'Registration successful',
      registration: result.recordset[0]
    });
  } catch (error) {
    console.error('Error registering for workshop:', error);
    if (error.number === 2627) { // Unique constraint violation
      res.status(400).json({ error: 'You are already registered for this workshop' });
    } else {
      res.status(500).json({ error: 'Failed to register for workshop' });
    }
  }
});

// ✅ Cancel workshop registration
router.delete('/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.headers['user-email'];

    if (!userEmail) {
      return res.status(400).json({ error: 'User email required' });
    }

    const pool = await poolPromise;

    // Check if registration exists
    const existingResult = await pool.request()
      .input('workshopId', sql.Int, id)
      .input('email', sql.VarChar(255), userEmail)
      .query('SELECT * FROM registrations WHERE workshop_id = @workshopId AND email = @email');

    if (existingResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Check if workshop is in the future
    const workshopResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT date FROM workshops WHERE id = @id');

    if (workshopResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    const workshop = workshopResult.recordset[0];
    if (new Date(workshop.date) < new Date()) {
      return res.status(400).json({ error: 'Cannot cancel registration for past workshops' });
    }

    // Cancel the registration
    await pool.request()
      .input('workshopId', sql.Int, id)
      .input('email', sql.VarChar(255), userEmail)
      .query('DELETE FROM registrations WHERE workshop_id = @workshopId AND email = @email');

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling registration:', error);
    res.status(500).json({ error: 'Failed to cancel registration' });
  }
});

// ✅ Create a workshop
router.post('/', async (req, res) => {
  try {
    const {
      title, description, date, time, location,
      capacity, category_id, image
    } = req.body;
    const created_by = getCreatedBy(req);

    if (!title || !description || !date || !time || !location || !capacity || !category_id || !created_by) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pool = await poolPromise;
    
    // Validate category exists
    const categoryResult = await pool.request()
      .input('category_id', sql.Int, category_id)
      .query('SELECT id FROM workshop_categories WHERE id = @category_id');
    
    if (categoryResult.recordset.length === 0) {
      return res.status(400).json({ error: 'Invalid category selected' });
    }

    const result = await pool.request()
      .input('title', sql.VarChar(255), title)
      .input('description', sql.Text, description)
      .input('date', sql.Date, date)
      .input('time', sql.VarChar(50), time)
      .input('location', sql.VarChar(255), location)
      .input('capacity', sql.Int, capacity)
      .input('category_id', sql.Int, category_id)
      .input('image', sql.VarChar(sql.MAX), image || null)
      .input('created_by', sql.Int, created_by)
      .query(`
        INSERT INTO workshops 
          (title, description, date, time, location, capacity, category_id, image, created_by, status)
        OUTPUT INSERTED.*
        VALUES (@title, @description, @date, @time, @location, @capacity, @category_id, @image, @created_by, 'pending')
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error creating workshop:', error);
    res.status(500).json({ error: 'Failed to create workshop' });
  }
});

// ✅ Update a workshop
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, date, time, location,
      capacity, category_id, image
    } = req.body;

    const pool = await poolPromise;

    const existing = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM workshops WHERE id = @id');

    if (existing.recordset.length === 0) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    const current = existing.recordset[0];

    if (new Date(current.date) < new Date()) {
      return res.status(400).json({ error: 'Cannot edit past workshop' });
    }

    // Validate category exists
    const categoryResult = await pool.request()
      .input('category_id', sql.Int, category_id)
      .query('SELECT id FROM workshop_categories WHERE id = @category_id');
    
    if (categoryResult.recordset.length === 0) {
      return res.status(400).json({ error: 'Invalid category selected' });
    }

    const newStatus = current.status === 'rejected' ? 'pending' : current.status;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.VarChar(255), title)
      .input('description', sql.Text, description)
      .input('date', sql.Date, date)
      .input('time', sql.VarChar(50), time)
      .input('location', sql.VarChar(255), location)
      .input('capacity', sql.Int, capacity)
      .input('category_id', sql.Int, category_id)
      .input('image', sql.VarChar(sql.MAX), image || null)
      .input('status', sql.VarChar(20), newStatus)
      .query(`
        UPDATE workshops
        SET title = @title,
            description = @description,
            date = @date,
            time = @time,
            location = @location,
            capacity = @capacity,
            category_id = @category_id,
            image = @image,
            updated_at = GETDATE(),
            status = @status
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error updating workshop:', error);
    res.status(500).json({ error: 'Failed to update workshop' });
  }
});

// ✅ Delete a workshop
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await poolPromise;

    const check = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM workshops WHERE id = @id');

    if (check.recordset.length === 0) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    const workshop = check.recordset[0];

    if (new Date(workshop.date) < new Date()) {
      return res.status(400).json({ error: 'Cannot delete past workshop' });
    }

    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM workshops WHERE id = @id');

    res.json({ message: 'Workshop deleted successfully' });
  } catch (error) {
    console.error('Error deleting workshop:', error);
    res.status(500).json({ error: 'Failed to delete workshop' });
  }
});

// ✅ Update workshop status (Admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminEmail = req.headers['admin-email'];
    
    console.log('Status update request:', { id, status, adminEmail }); // Debug log

    // Check admin authentication
    if (!adminEmail || adminEmail !== 'zconnect.admin@gmail.com') {
      console.log('Admin authentication failed'); // Debug log
      return res.status(403).json({ error: 'Admin privileges required' });
    }

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be pending, approved, or rejected' });
    }

    const pool = await poolPromise;

    // Check if workshop exists
    const existing = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM workshops WHERE id = @id');

    if (existing.recordset.length === 0) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    // Update workshop status
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.VarChar(20), status)
      .query(`
        UPDATE workshops
        SET status = @status,
            updated_at = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    console.log('Status updated successfully:', result.recordset[0]); // Debug log
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error updating workshop status:', error);
    res.status(500).json({ error: 'Failed to update workshop status' });
  }
});

// Get workshop participants (Staff and Admin access)
router.get('/:id/participants', async (req, res) => {
  try {
    const { id } = req.params;
    const adminEmail = req.headers['admin-email'];
    const staffId = req.headers['staff-id'];
    
    // Check if user is admin or staff
    const isAdmin = adminEmail && adminEmail === 'zconnect.admin@gmail.com';
    const isStaff = staffId && !isNaN(parseInt(staffId, 10));
    
    if (!isAdmin && !isStaff) {
      return res.status(403).json({ error: 'Staff or Admin privileges required' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('workshopId', sql.Int, id)
      .query(`
        SELECT r.*, w.title as workshop_title
        FROM registrations r
        INNER JOIN workshops w ON r.workshop_id = w.id
        WHERE r.workshop_id = @workshopId
        ORDER BY r.registered_at DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});
module.exports = router;