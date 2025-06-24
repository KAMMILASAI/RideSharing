const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const auth = require('../middleware/auth');

// Get all rides (with driver info)
router.get('/', async (req, res) => {
  try {
    // Use 'driver' not 'user' for population, as per your Ride model
    const rides = await Ride.find().populate('driver', 'name email');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch rides', error: err.message });
  }
});

// Add a new ride
router.post('/', auth, async (req, res) => {
  try {
    const { from, to, time, seatsAvailable, price } = req.body;
    console.log('Add Ride request body:', req.body); // Debug log
    if (!from || !to || !time || seatsAvailable == null || price == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const ride = new Ride({
      driver: req.user.id,
      from,
      to,
      time,
      seatsAvailable,
      price,
      createdAt: new Date(),
      requests: []
    });
    await ride.save();
    res.status(201).json(ride);
  } catch (err) {
    console.error('Failed to add ride:', err);
    res.status(500).json({ message: 'Failed to add ride', error: err.message });
  }
});

// Get ride history for the logged-in user (completed rides)
router.get('/history', auth, async (req, res) => {
  try {
    const rides = await Ride.find({
      $or: [
        { driver: req.user.id },
        { 'requests.user': req.user.id }
      ],
      status: 'completed'
    }).populate('driver', 'name email');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ride history', error: err.message });
  }
});

module.exports = router;
