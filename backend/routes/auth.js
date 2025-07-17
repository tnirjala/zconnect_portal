const express = require('express');
const bcrypt = require('bcryptjs');
const { execute } = require('../db');
const sql = require('mssql');

const router = express.Router();

// 🔐 Hardcoded admin credentials
const adminEmail = 'zconnect.admin@gmail.com';
const adminPassword = '@dmin890';

// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password, role = 'user', specialization } = req.body;

  console.log('Signup attempt:', { name, email, role, specialization }); // Debug log

  if (!name || !email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Name, email, and password are required' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false,
      message: 'Password must be at least 6 characters' 
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
    // Check if email exists
    const result = await execute(
      'SELECT * FROM users WHERE email = @email',
      [{ name: 'email', type: sql.VarChar, value: email }]
    );

    if (result.recordset.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered' 
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

    console.log('User registered successfully:', email); // Debug log

    res.status(201).json({ 
      success: true,
      message: 'User registered successfully' 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', email); // Debug log

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  try {
    // Handle hardcoded admin first
    if (email === adminEmail && password === adminPassword) {
      console.log('Admin login successful'); // Debug log
      return res.json({
        success: true,
        message: 'Admin login successful',
        user: {
          id: 0, // Special ID for hardcoded admin
          name: 'System Admin',
          email: adminEmail,
          role: 'admin',
          specialization: null
        },
        redirectUrl: '/admin/dashboard'
      });
    }

    // Check database users
    const result = await execute(
      'SELECT * FROM users WHERE email = @email',
      [{ name: 'email', type: sql.VarChar, value: email }]
    );

    const users = result.recordset;

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Remove password from response
    delete user.password;

    console.log('User login successful:', user.email, user.role); // Debug log

    // Determine redirect URL based on role
    let redirectUrl = '/user/dashboard'; // default
    switch (user.role) {
      case 'admin':
        redirectUrl = '/admin/dashboard';
        break;
      case 'counselor':
        redirectUrl = '/counselor/dashboard';
        break;
      case 'staff':
        redirectUrl = '/staff/dashboard';
        break;
      default:
        redirectUrl = '/user/dashboard';
    }

    res.json({
      success: true,
      message: 'Login successful',
      user,
      redirectUrl
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});

// Forget password
router.post('/forget-password', async (req, res) => {
  const { email, newPassword } = req.body;

  console.log('Password reset attempt:', email); // Debug log

  if (!email || !newPassword) {
    return res.status(400).json({ 
      success: false,
      message: 'Email and new password are required' 
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters'
    });
  }

  // Prevent admin password change via public route
  if (email === adminEmail) {
    return res.status(403).json({ 
      success: false,
      message: 'Cannot reset system admin password through this method' 
    });
  }

  try {
    const result = await execute(
      'SELECT * FROM users WHERE email = @email',
      [{ name: 'email', type: sql.VarChar, value: email }]
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Email not found' 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await execute(
      'UPDATE users SET password = @password WHERE email = @email',
      [
        { name: 'password', type: sql.VarChar, value: hashedPassword },
        { name: 'email', type: sql.VarChar, value: email }
      ]
    );

    console.log('Password reset successful:', email); // Debug log

    res.json({ 
      success: true,
      message: 'Password updated successfully' 
    });
  } catch (error) {
    console.error('Forget password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get current user profile (if logged in)
router.get('/profile', async (req, res) => {
  const userEmail = req.headers['user-email'];
  
  if (!userEmail) {
    return res.status(401).json({
      success: false,
      message: 'User email header required'
    });
  }

  try {
    // Handle hardcoded admin
    if (userEmail === adminEmail) {
      return res.json({
        success: true,
        user: {
          id: 0,
          name: 'System Admin',
          email: adminEmail,
          role: 'admin',
          specialization: null
        }
      });
    }

    const result = await execute(
      'SELECT id, name, email, role, specialization FROM users WHERE email = @email',
      [{ name: 'email', type: sql.VarChar, value: userEmail }]
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: result.recordset[0]
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Mood logging route (after login)
router.post('/user/mood', async (req, res) => {
  const { mood } = req.body;
  const userId = req.headers['user-id'];

  if (!userId || !mood) {
    return res.status(400).json({
      success: false,
      message: 'User ID and mood are required'
    });
  }

  try {
    await execute(`
      MERGE user_profiles AS target
      USING (SELECT @userId AS user_id) AS source
      ON target.user_id = source.user_id
      WHEN MATCHED THEN 
        UPDATE SET mood_today = @mood, last_mood_logged = GETDATE(), updated_at = GETDATE()
      WHEN NOT MATCHED THEN
        INSERT (user_id, mood_today, last_mood_logged, updated_at)
        VALUES (@userId, @mood, GETDATE(), GETDATE());
    `, [
      { name: 'userId', type: sql.Int, value: userId },
      { name: 'mood', type: sql.VarChar, value: mood }
    ]);

    res.json({
      success: true,
      message: 'Mood logged successfully'
    });
  } catch (error) {
    console.error('Mood logging error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});




module.exports = router;