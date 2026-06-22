// routes/bookings.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'bookings route working' });
});

module.exports = router;