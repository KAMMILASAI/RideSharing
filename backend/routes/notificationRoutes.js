const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const RideRequest = require('../models/RideRequest');
const Ride = require('../models/Ride');
const auth = require('../middleware/auth');

// Get notifications for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    const unreadCount = notifications.filter(n => !n.read).length;
    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: err.message });
  }
});

// Mark notification as read
router.post('/:id/read', auth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as read', error: err.message });
  }
});

// Accept or reject a ride request
router.post('/request/:requestId/:action', auth, async (req, res) => {
  // action: 'accept' or 'reject'
  try {
    const { requestId, action } = req.params;
    let rideRequest = await RideRequest.findById(requestId).populate('ride');
    if (!rideRequest) return res.status(404).json({ message: 'Request not found' });
    // If ride is not populated, fetch it
    if (!rideRequest.ride) {
      const rideDoc = await Ride.findById(rideRequest.ride);
      if (!rideDoc) return res.status(404).json({ message: 'Ride not found' });
      rideRequest.ride = rideDoc;
    }
    if (String(rideRequest.ride.driver) !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (action === 'accept') {
      rideRequest.status = 'accepted';
    } else if (action === 'reject') {
      rideRequest.status = 'rejected';
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }
    await rideRequest.save();
    // Update ride availableSeats and status if accepted
    if (action === 'accept') {
      rideRequest.ride.availableSeats = Math.max(0, rideRequest.ride.availableSeats - 1);
      // If no seats left, set ride status to 'full'
      if (rideRequest.ride.availableSeats === 0) {
        rideRequest.ride.status = 'full';
      }
      await rideRequest.ride.save();
      // Schedule ride deletion in 1 hour
      setTimeout(async () => {
        try {
          await rideRequest.ride.deleteOne();
          console.log(`Ride ${rideRequest.ride._id} deleted automatically after 1 hour of acceptance.`);
        } catch (err) {
          console.error('Failed to auto-delete ride:', err);
        }
      }, 3600000); // 1 hour in ms
    }
    // Notify passenger
    await Notification.create({
      user: rideRequest.passenger,
      message: `Your request to join the ride from ${rideRequest.ride.from} to ${rideRequest.ride.to} was ${action}ed${action === 'accept' && rideRequest.ride.availableSeats === 0 ? ' (Ride is now full)' : ''}`,
      type: 'ride_status',
      data: { rideId: rideRequest.ride._id, status: rideRequest.status }
    });
    // Remove the original ride_request notification for this request
    await Notification.deleteMany({
      user: req.user.id,
      type: 'ride_request',
      'data.requestId': rideRequest._id
    });
    res.json({ success: true, status: rideRequest.status });
  } catch (err) {
    console.error('Accept/Reject Request Error:', err);
    res.status(500).json({ message: 'Failed to update request', error: err.message, stack: err.stack });
  }
});

// Delete a notification by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    await Notification.deleteOne({ _id: req.params.id, user: req.user.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete notification', error: err.message });
  }
});

module.exports = router;
