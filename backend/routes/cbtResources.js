const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { sql, poolPromise } = require('../db');

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/cbtResources'));
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Utility
const getCreatedBy = (req) => parseInt(req.headers['staff-id'], 10);

// Upload file and insert into database
router.post('/upload-file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { category, type, description } = req.body;
    const createdBy = getCreatedBy(req);

    if (!category || !type || !createdBy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const fileUrl = `/uploads/cbtResources/${req.file.filename}`;

    const pool = await poolPromise;
    await pool.request()
      .input('title', sql.VarChar(255), category)
      .input('description', sql.Text, description || '')
      .input('type', sql.VarChar(50), type)
      .input('file_url', sql.VarChar(sql.MAX), fileUrl)
      .input('created_by', sql.Int, createdBy)
      .query(`
        INSERT INTO cbt_resources (title, description, type, file_url, created_by)
        VALUES (@title, @description, @type, @file_url, @created_by)
      `);

    return res.status(200).json({
      message: 'File uploaded and saved in database',
      file_url: fileUrl,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});
// Get resources uploaded by a specific staff
router.get('/', async (req, res) => {
  try {
    const createdBy = getCreatedBy(req);
    const pool = await poolPromise;
    const result = await pool.request()
      .input('created_by', sql.Int, createdBy)
      .query(`SELECT * FROM cbt_resources WHERE created_by = @created_by ORDER BY created_at DESC`);

    res.json(result.recordset);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});
// Delete a resource
router.delete('/:id', async (req, res) => {
  try {
    const resourceId = req.params.id;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, resourceId)
      .query(`DELETE FROM cbt_resources WHERE id = @id`);

    res.json({ message: 'Resource deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});
// Update a resource
router.put('/update', async (req, res) => {
  try {
    const { id, title, type, description, file_url } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.VarChar(255), title)
      .input('type', sql.VarChar(50), type)
      .input('description', sql.Text, description || '')
      .input('file_url', sql.VarChar(sql.MAX), file_url)
      .query(`
        UPDATE cbt_resources
        SET title = @title,
            type = @type,
            description = @description,
            file_url = @file_url,
            updated_at = GETDATE()
        WHERE id = @id
      `);

    res.status(200).json({ message: 'Resource updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});


// Get all CBT resources (for admin view)
router.get('/all', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT * FROM cbt_resources ORDER BY created_at DESC`);
    res.json(result.recordset);
  } catch (err) {
    console.error('Admin fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch resources for admin' });
  }
});


// Update resource status by admin (approve/reject)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.VarChar(20), status)
      .query(`UPDATE cbt_resources SET status = @status, updated_at = GETDATE() WHERE id = @id`);

    res.json({ message: 'Status updated successfully' });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});


// ✅ GET all approved CBT resources (for users)
router.get('/approved', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT * FROM cbt_resources WHERE status = 'approved' ORDER BY created_at DESC`);
    res.json(result.recordset);
  } catch (err) {
    console.error('Fetch approved resources error:', err);
    res.status(500).json({ error: 'Failed to fetch approved resources' });
  }
});

    

module.exports = router;
