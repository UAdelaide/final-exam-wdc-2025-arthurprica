const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

const session = require('express-session');  // Add session

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

app.get('/dogs', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT Dogs.name AS dog_name, Dogs.size, Users.username AS owner_username
      FROM Dogs
      JOIN Users ON Dogs.owner_id = Users.user_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to return list of dogs', details: err.message });
  }
});

// Export the app instead of listening here
module.exports = app;