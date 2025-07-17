const express = require('express');
const bcrypt = require('bcryptjs');
const { execute } = require('../db');
const sql = require('mssql');
const router = express.Router();

// Middleware to authenticate admin
const authenticateAdmin = async (req, res, next) => {
  const adminEmail = req.headers['admin-email'];
  
  console.log('Auth check - Admin email:', adminEmail); // Debug log
  
  if (!adminEmail || adminEmail !== 'zconnect.admin@gmail.com') {
    return res.status(403).json({ 
      success: false,
      message: 'Admin access required' 
    });
  }
  next();
};

// Get all users (for admin)
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    console.log('Fetching all users...'); // Debug log
    
    const result = await execute(
      'SELECT id, name, email, role, specialization FROM users ORDER BY id DESC',
      []
    );
    
    console.log('Users fetched:', result.recordset.length); // Debug log
    
    res.json({
      success: true,
      data: result.recordset,
      message: `Found ${result.recordset.length} users`
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Create new user (admin only)
router.post('/users', authenticateAdmin, async (req, res) => {
  const { name, email, password, role, specialization } = req.body;

  console.log('Creating user:', { name, email, role, specialization }); // Debug log

  // Validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, password, and role are required'
    });
  }

  // Validate role
  const validRoles = ['user', 'staff', 'counselor', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Must be one of: user, staff, counselor, admin'
    });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  try {
    // Check if email exists
    const emailCheck = await execute(
      'SELECT email FROM users WHERE email = @email',
      [{ name: 'email', type: sql.VarChar, value: email }]
    );

    if (emailCheck.recordset.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await execute(
      'INSERT INTO users (name, email, password, role, specialization) VALUES (@name, @email, @password, @role, @specialization)',
      [
        { name: 'name', type: sql.VarChar, value: name },
        { name: 'email', type: sql.VarChar, value: email },
        { name: 'password', type: sql.VarChar, value: hashedPassword },
        { name: 'role', type: sql.VarChar, value: role },
        { name: 'specialization', type: sql.VarChar, value: specialization || null }
      ]
    );

    console.log('User created successfully:', email); // Debug log

    res.status(201).json({
      success: true,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
});

// Update user (admin only)
router.put('/users/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, role, specialization, password } = req.body;

  console.log('Updating user:', id, { name, email, role, specialization }); // Debug log

  // Validation
  if (!name || !email || !role) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and role are required'
    });
  }

  // Validate role
  const validRoles = ['user', 'staff', 'counselor', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Must be one of: user, staff, counselor, admin'
    });
  }

  try {
    // Check if user exists
    const userCheck = await execute(
      'SELECT id, email FROM users WHERE id = @id',
      [{ name: 'id', type: sql.Int, value: parseInt(id) }]
    );

    if (userCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email exists for other users
    const emailCheck = await execute(
      'SELECT id FROM users WHERE email = @email AND id != @id',
      [
        { name: 'email', type: sql.VarChar, value: email },
        { name: 'id', type: sql.Int, value: parseInt(id) }
      ]
    );

    if (emailCheck.recordset.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists for another user'
      });
    }

    let updateQuery = 'UPDATE users SET name = @name, email = @email, role = @role, specialization = @specialization';
    const params = [
      { name: 'name', type: sql.VarChar, value: name },
      { name: 'email', type: sql.VarChar, value: email },
      { name: 'role', type: sql.VarChar, value: role },
      { name: 'specialization', type: sql.VarChar, value: specialization || null },
      { name: 'id', type: sql.Int, value: parseInt(id) }
    ];

    // Only update password if provided
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ', password = @password';
      params.push({ name: 'password', type: sql.VarChar, value: hashedPassword });
    }

    updateQuery += ' WHERE id = @id';

    await execute(updateQuery, params);

    console.log('User updated successfully:', id); // Debug log

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
});

// Delete user (admin only)
router.delete('/users/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  console.log('Deleting user:', id); // Debug log

  try {
    // Check if user exists and get their role
    const userCheck = await execute(
      'SELECT role, email FROM users WHERE id = @id',
      [{ name: 'id', type: sql.Int, value: parseInt(id) }]
    );

    if (userCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userCheck.recordset[0];

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin user'
      });
    }

    // Prevent deleting the hardcoded admin email
    if (user.email === 'zconnect.admin@gmail.com') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete system admin'
      });
    }

    await execute(
      'DELETE FROM users WHERE id = @id',
      [{ name: 'id', type: sql.Int, value: parseInt(id) }]
    );

    console.log('User deleted successfully:', id); // Debug log

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});




// ✅ keep this one — add logs here
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const result = await execute(
      `SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role`,
      []
    );

    console.log("✔️ Admin stats accessed");
    console.log("Returning user stats:", result.recordset);

    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("❌ Error in /stats:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/session-participants-count', authenticateAdmin, async (req, res) => {
  try {
    const result = await execute(
      `SELECT s.title AS sessionName, COUNT(cp.id) AS participantsCount
FROM counseling_sessions s
LEFT JOIN counseling_participants cp ON s.id = cp.session_id
GROUP BY s.title`,
      []
    );

    console.log("✔️ Session participants count accessed");
    console.log("Returning session stats:", result.recordset);

    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("❌ Error in /session-participants-count:", error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch session participants count', error: error.message });
  }
});


//workshop count
router.get('/workshops-count', authenticateAdmin, async (req, res) => {
  try {
    const result = await execute(
      `SELECT wc.title AS category, COUNT(w.id) AS count
 FROM workshops w
 JOIN workshop_categories wc ON w.category_id = wc.id
 GROUP BY wc.title`,
      []
    );

    console.log("✔️ Workshop count accessed");
    console.log("Returning workshops stats:", result.recordset);

    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("❌ Error in /workshops-count:", error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch workshops count', error: error.message });
  }
});


//cbtresources
router.get('/cbt-resources/stats', authenticateAdmin, async (req, res) => {
  try {
    const result = await execute(
      `SELECT type AS type, COUNT(*) AS count FROM cbt_resources GROUP BY type;`,
      []
    );

    console.log("✔️ CBT resources stats accessed");
    console.log("Returning CBT stats:", result.recordset);

    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("❌ Error in /cbt-resources/stats:", error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch CBT resources stats', error: error.message });
  }
});

router.get('/ping-stats', authenticateAdmin, (req, res) => {
  res.json({ success: true, data: [ { test: 'ok' } ] });
});


module.exports = router;