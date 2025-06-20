const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

const session = require('express-session');  // Add session

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret', // For signing session ID cookies
  resave: false,                                  // Don’f unmodified
  saveUninitialized: false                        // Don’t create session until something is stored
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;