var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

const db = require('./db');

(async () => {
  try {
    const [users] = await db.query('SELECT COUNT(*) AS count FROM Users');
    if (users[0].count === 0) {
      await db.query(`
        INSERT INTO Users (username, email, password_hash, role) VALUES
        ('alice123', 'alice@example.com', 'hashed123', 'owner'),
        ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
        ('carol123', 'carol@example.com', 'hashed789', 'owner')
      `);

      await db.query(`
        INSERT INTO Dogs (owner_id, name, size)
        VALUES
        ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
        ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small')
      `);

      await db.query(`
        INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
        VALUES
        ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted')
      `);

      await db.query(`
        INSERT INTO WalkApplications (request_id, walker_id, status)
        VALUES
        (2, (SELECT user_id FROM Users WHERE username = 'bobwalker'), 'accepted')
      `);

      // Insert walk rating
      await db.query(`
        INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating, comments)
        VALUES
        (2,
         (SELECT user_id FROM Users WHERE username = 'bobwalker'),
         (SELECT user_id FROM Users WHERE username = 'carol123'),
         5, 'Excellent walk!')
      `);

      console.log('Test data inserted');
    }
  } catch (err) {
    console.error('Error inserting test data:', err.message);
  }
})();

module.exports = app;
