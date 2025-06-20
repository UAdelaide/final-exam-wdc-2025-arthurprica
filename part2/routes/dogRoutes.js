const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT Dogs.dog_id, Dogs.name AS dog_name, Dogs.size, Dogs.owner_id, Dogs.photo
      FROM Dogs
      JOIN Users ON Dogs.owner_id = Users.user_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to return list of dogs', details: err.message });
  }
});

module.exports = router;