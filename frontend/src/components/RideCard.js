import React from 'react';

const RideCard = ({ ride, onRequest }) => {
  const dateObj = ride.time ? new Date(ride.time) : null;
  const dateStr = dateObj ? dateObj.toLocaleDateString() : '';
  const timeStr = dateObj ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="ride-card">
      <div><strong>From:</strong> {ride.from}</div>
      <div><strong>To:</strong> {ride.to}</div>
      <div><strong>Date:</strong> {dateStr}</div>
      <div><strong>Time:</strong> {timeStr}</div>
      <div><strong>Seats Available:</strong> {ride.availableSeats ?? ride.seatsAvailable}</div>
      <div><strong>Price:</strong> ₹{ride.price}</div>
      <div><strong>Status:</strong> {ride.status ? ride.status.charAt(0).toUpperCase() + ride.status.slice(1) : 'Active'}</div>
      {ride.driver && (
        <div><strong>Driver:</strong> {ride.driver.name || ride.driver.email || 'N/A'}</div>
      )}
      {onRequest && (
        <button onClick={() => onRequest(ride)} className="request-btn">Request</button>
      )}
    </div>
  );
};

export default RideCard;
