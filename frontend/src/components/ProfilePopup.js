import React from 'react';
import { Link } from 'react-router-dom';

const ProfilePopup = ({ user, onClose }) => (
  <div className="profile-popup">
    <h2>{user.name}</h2>
    <p><strong>Email:</strong> {user.email}</p>
    <p><strong>Phone:</strong> {user.phone}</p>
    <p><strong>Age:</strong> {user.age}</p>
    <p><strong>Address:</strong> {user.address}</p>
    <button onClick={onClose}>Close</button>
  </div>
);

export default ProfilePopup;
