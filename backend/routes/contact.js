const express = require('express');
const router = express.Router();
const { execute, sql } = require('../db');

// POST /api/contact - Save contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const query = `
      INSERT INTO contact_messages (name, email, message) 
      VALUES (@name, @email, @message)
    `;

    const params = [
      { name: 'name', type: sql.VarChar, value: name },
      { name: 'email', type: sql.VarChar, value: email },
      { name: 'message', type: sql.Text, value: message }
    ];

    await execute(query, params);
    
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// GET /api/contact - Get all contact messages (for staff dashboard)
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, name, email, message, created_at 
      FROM contact_messages 
      ORDER BY created_at DESC
    `;

    const result = await execute(query);
    res.json(result.recordset);
  } catch (error) {
    console.error('Contact retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve messages.' });
  }
});

module.exports = router; 