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
    const { from, to, date, time, availableSeats, price } = req.body;
    console.log('Add Ride request body:', req.body); // Debug log
    if (!from || !to || !date || !time || availableSeats == null || price == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const ride = new Ride({
      driver: req.user.id,
      from,
      to,
      date,
      time,
      availableSeats,
      price
    });
    await ride.save();
    res.status(201).json(ride);
  } catch (err) {
    console.error('Failed to add ride:', err);
    res.status(500).json({ message: 'Failed to add ride', error: err.message });
  }
});

// Get ride history for the logged-in user (as driver or passenger)

router.get('/history', auth, async (req, res) => {
  try {
    // Find all ride requests for this user
    const userRequests = await RideRequest.find({ passenger: req.user.id });
    const requestedRideIds = userRequests.map(r => r.ride);
    // Find rides where user is driver or passenger
    const rides = await Ride.find({
      $or: [
        { driver: req.user.id },
        { _id: { $in: requestedRideIds } }
      ]
    }).populate('driver', 'name email');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ride history', error: err.message });
  }
});

// Request to join a ride
const RideRequest = require('../models/RideRequest');
const Notification = require('../models/Notification');

router.post('/:id/request', auth, async (req, res) => {
  try {
    const rideId = req.params.id;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    // Prevent driver from requesting their own ride
    if (String(ride.driver) === req.user.id) {
      return res.status(400).json({ message: 'You cannot request your own ride' });
    }
    // Prevent duplicate requests
    let existingRequest = await RideRequest.findOne({ ride: rideId, passenger: req.user.id });
    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested this ride' });
    }
    // Create ride request
    const rideRequest = await RideRequest.create({
      ride: rideId,
      passenger: req.user.id,
      status: 'requested'
    });
    // Notify ride owner
    await Notification.create({
      user: ride.driver && ride.driver._id ? ride.driver._id : ride.driver,
      message: `New ride request from user for your ride from ${ride.from} to ${ride.to}`,
      type: 'ride_request',
      data: { rideId, requestId: rideRequest._id, passenger: req.user.id, status: rideRequest.status }
    });
    res.status(201).json({ success: true, rideRequest });
  } catch (err) {
    console.error('Request Ride Error:', err);
    res.status(500).json({ message: 'Failed to request ride', error: err.message, stack: err.stack });
  }
});

// Delete a ride (only by driver)
router.delete('/:id', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (String(ride.driver) !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this ride' });
    }
    await ride.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete ride', error: err.message });
  }
});

module.exports = router;
