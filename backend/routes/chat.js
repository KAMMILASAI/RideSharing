const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Get global chat history (all messages where ride is null)
router.get('/global', auth, async (req, res) => {
  try {
    const messages = await Message.find({ ride: null })
      .sort({ createdAt: 1 })
      .populate('sender', 'name');
    // Return sender as name string for each message
    res.json(messages.map(m => ({
      ...m.toObject(),
      sender: m.sender && m.sender.name ? m.sender.name : m.sender
    })));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
});

module.exports = router;
