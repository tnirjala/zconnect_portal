const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/profiles/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + req.userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
});

// Authentication middleware
const authenticateUser = (req, res, next) => {
  const userId = req.headers['user-id'] || req.body.userId;
  if (!userId) return res.status(401).json({ success: false, error: 'User ID required' });
  req.userId = parseInt(userId);
  next();
};

// GET user profile
router.get('/', authenticateUser, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.Int, req.userId)
      .query(`
        SELECT 
          u.id, u.name, u.email, u.role, u.specialization, u.created_at,
          up.phone, up.gender, up.dob, up.profile_picture, up.bio, 
          up.mood_today, up.last_mood_logged, up.updated_at
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE u.id = @userId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = result.recordset[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        created_at: user.created_at,
        profile: {
          phone: user.phone,
          gender: user.gender,
          dob: user.dob,
          profile_picture: user.profile_picture,
          bio: user.bio,
          mood_today: user.mood_today,
          last_mood_logged: user.last_mood_logged,
          updated_at: user.updated_at
        }
      }
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch profile', details: error.message });
  }
});

// UPDATE user profile
router.put('/', authenticateUser, upload.single('profilePicture'), async (req, res) => {
  let transaction;
  try {
    const { name, phone, gender, dob, bio } = req.body;
    const profilePicture = req.file?.filename;
    const pool = await poolPromise;

    transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // 1. Update users table
      await transaction.request()
        .input('userId', sql.Int, req.userId)
        .input('name', sql.NVarChar(255), name?.trim())
        .query('UPDATE users SET name = @name WHERE id = @userId');

      // 2. Use MERGE for user_profiles (like mood update)
      const mergeQuery = `
        MERGE INTO user_profiles AS target
        USING (SELECT @userId AS user_id) AS source
        ON target.user_id = source.user_id
        WHEN MATCHED THEN
          UPDATE SET 
            phone = @phone,
            gender = @gender,
            dob = @dob,
            bio = @bio,
            ${profilePicture ? 'profile_picture = @profilePicture,' : ''}
            updated_at = GETDATE()
        WHEN NOT MATCHED THEN
          INSERT (user_id, phone, gender, dob, bio, profile_picture, updated_at)
          VALUES (@userId, @phone, @gender, @dob, @bio, @profilePicture, GETDATE());
      `;

      const request = transaction.request()
        .input('userId', sql.Int, req.userId)
        .input('phone', sql.NVarChar(20), phone || null)
        .input('gender', sql.NVarChar(50), gender || null)
        .input('dob', sql.Date, dob ? new Date(dob) : null)
        .input('bio', sql.NVarChar(sql.MAX), bio || null);

      if (profilePicture) {
        request.input('profilePicture', sql.NVarChar(255), profilePicture);
      }

      await request.query(mergeQuery);

      await transaction.commit();

      // Return complete updated user data
      const updatedUser = await pool.request()
        .input('userId', sql.Int, req.userId)
        .query(`
          SELECT 
            u.id, u.name, u.email, u.role, u.specialization, u.created_at,
            up.phone, up.gender, up.dob, up.profile_picture, up.bio, 
            up.mood_today, up.last_mood_logged, up.updated_at
          FROM users u
          LEFT JOIN user_profiles up ON u.id = up.user_id
          WHERE u.id = @userId
        `);

      res.json({ 
        success: true, 
        message: 'Profile updated successfully',
        user: updatedUser.recordset[0]
      });

    } catch (innerError) {
      if (transaction) await transaction.rollback();
      if (req.file) fs.unlinkSync(req.file.path);
      throw innerError;
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update profile',
      details: error.message 
    });
  }
});

// SERVE profile picture
router.get('/picture/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/profiles/', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }
    
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving profile picture:', error);
    res.status(500).json({ success: false, error: 'Failed to serve image' });
  }
});

// CHECK mood status - NEW ENDPOINT
router.get('/mood/check', authenticateUser, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.Int, req.userId)
      .query(`
        SELECT last_mood_logged 
        FROM user_profiles 
        WHERE user_id = @userId
      `);

    let canLogMood = true;
    let hoursUntilNext = 0;

    if (result.recordset.length > 0 && result.recordset[0].last_mood_logged) {
      const lastLogged = new Date(result.recordset[0].last_mood_logged);
      const now = new Date();
      const hoursSinceLastLog = (now - lastLogged) / (1000 * 60 * 60);
      
      // Allow logging mood once every 24 hours
      if (hoursSinceLastLog < 24) {
        canLogMood = false;
        hoursUntilNext = Math.ceil(24 - hoursSinceLastLog);
      }
    }

    res.json({
      success: true,
      canLogMood,
      hoursUntilNext
    });

  } catch (error) {
    console.error('Error checking mood status:', error);
    res.status(500).json({ success: false, error: 'Failed to check mood status' });
  }
});

// UPDATE user mood - FIXED VALID MOODS
router.post('/mood', authenticateUser, async (req, res) => {
  try {
    const { mood } = req.body;
    // Updated valid moods to match frontend
    const validMoods = ['very_happy', 'happy', 'neutral', 'sad', 'very_sad', 'anxious', 'angry', 'peaceful'];
    
    if (!validMoods.includes(mood)) {
      return res.status(400).json({ success: false, error: 'Invalid mood value' });
    }

    const pool = await poolPromise;

    // Check if user can log mood (24 hour limit)
    const checkResult = await pool.request()
      .input('userId', sql.Int, req.userId)
      .query(`
        SELECT last_mood_logged 
        FROM user_profiles 
        WHERE user_id = @userId
      `);

    if (checkResult.recordset.length > 0 && checkResult.recordset[0].last_mood_logged) {
      const lastLogged = new Date(checkResult.recordset[0].last_mood_logged);
      const now = new Date();
      const hoursSinceLastLog = (now - lastLogged) / (1000 * 60 * 60);
      
      if (hoursSinceLastLog < 24) {
        return res.status(400).json({ 
          success: false, 
          error: 'You can only log your mood once every 24 hours',
          canLogTomorrow: true,
          hoursUntilNext: Math.ceil(24 - hoursSinceLastLog)
        });
      }
    }

    // Log the mood
    await pool.request()
      .input('userId', sql.Int, req.userId)
      .input('mood', sql.NVarChar(50), mood)
      .query(`
        MERGE INTO user_profiles AS target
        USING (SELECT @userId AS user_id) AS source
        ON target.user_id = source.user_id
        WHEN MATCHED THEN
          UPDATE SET 
            mood_today = @mood,
            last_mood_logged = GETDATE()
        WHEN NOT MATCHED THEN
          INSERT (user_id, mood_today, last_mood_logged, updated_at)
          VALUES (@userId, @mood, GETDATE(), GETDATE());
      `);

    res.json({ success: true, message: 'Mood updated successfully' });
  } catch (error) {
    console.error('Error updating mood:', error);
    res.status(500).json({ success: false, error: 'Failed to update mood' });
  }
});

module.exports = router;
