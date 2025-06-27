import React from 'react';

const NotificationPopup = ({ message, onClose }) => (
  <div className="notification-popup">
    <span>{message}</span>
    <button onClick={onClose}>Close</button>
  </div>
);

export default NotificationPopup;
