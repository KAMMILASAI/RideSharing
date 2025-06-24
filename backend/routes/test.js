const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Message = require('../models/Message');

router.get('/db-status', async (req, res) => {
  try {
    const rides = await Ride.countDocuments();
    const users = await User.countDocuments();
    const notifications = await Notification.countDocuments();
    const messages = await Message.countDocuments();
    res.json({ rides, users, notifications, messages });
  } catch (err) {
    res.status(500).json({ message: 'DB status check failed', error: err.message });
  }
});

module.exports = router;
