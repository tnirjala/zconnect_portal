const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db'); 

// Get all categories
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT c.*, u.name AS created_by_name
      FROM workshop_categories c
      LEFT JOIN users u ON c.created_by = u.id
      ORDER BY c.created_at DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get single category by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT c.*, u.name AS created_by_name
        FROM workshop_categories c
        LEFT JOIN users u ON c.created_by = u.id
        WHERE c.id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create new category
router.post('/', async (req, res) => {
  try {
    const { title, description, created_by } = req.body;

    if (!title || !created_by) {
      return res.status(400).json({ error: 'Title and created_by are required' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('title', sql.VarChar(255), title)
      .input('description', sql.Text, description || '')
      .input('created_by', sql.Int, created_by)
      .query(`
        INSERT INTO workshop_categories (title, description, created_by)
        OUTPUT INSERTED.*
        VALUES (@title, @description, @created_by)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category by id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.VarChar(255), title)
      .input('description', sql.Text, description || '')
      .query(`
        UPDATE workshop_categories
        SET title = @title,
            description = @description,
            updated_at = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category by id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await poolPromise;

    // Check if category is used by any workshops
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT COUNT(*) as count FROM workshops WHERE category_id = @id');

    if (checkResult.recordset[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category. It is being used by existing workshops.' 
      });
    }

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM workshop_categories WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});


// ✅ Get all CBT resources (Admin view)
router.get('/admin', async (req, res) => {
  try {
    const adminEmail = req.headers['admin-email'];
    if (!adminEmail || adminEmail !== 'zconnect.admin@gmail.com') {
      return res.status(403).json({ error: 'Admin privileges required' });
    }

    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT r.*, c.title AS category_name
      FROM cbt_resources r
      LEFT JOIN cbt_categories c ON r.category_id = c.id
      ORDER BY r.created_at DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching CBT resources for admin:', error);
    res.status(500).json({ error: 'Failed to fetch CBT resources' });
  }
});


module.exports = router;
