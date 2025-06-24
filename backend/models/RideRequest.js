const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['requested', 'accepted', 'rejected', 'completed'], default: 'requested' },
}, { timestamps: true });

module.exports = mongoose.model('RideRequest', rideRequestSchema);
