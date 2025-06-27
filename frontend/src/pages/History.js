import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import rideService from '../services/rideService';
import { AuthContext } from '../context/AuthContext';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchHistory = async () => {
      setLoading(true);
      const data = await rideService.getHistory();
      setHistory(data || []);
      setLoading(false);
    };
    fetchHistory();
  }, [user, navigate]);

  return (
    <div className="history-container">
      <h2>Ride History</h2>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <ul className="history-list">
          {history.map((ride, idx) => {
            const dateObj = ride.date ? new Date(ride.date) : null;
            const dateStr = dateObj ? dateObj.toLocaleDateString() : '';
            const timeStr = ride.time || '';
            const isDriver = user && ride.driver && (String(ride.driver._id || ride.driver) === String(user._id));
            return (
              <li key={ride._id || idx} className={`history-card status-${ride.status}`}>
                <div><strong>From:</strong> {ride.from}</div>
                <div><strong>To:</strong> {ride.to}</div>
                <div><strong>Date:</strong> {dateStr}</div>
                <div><strong>Time:</strong> {timeStr}</div>
                <div><strong>Price:</strong> ₹{ride.price}</div>
                <div><strong>Status:</strong> {ride.status ? ride.status.charAt(0).toUpperCase() + ride.status.slice(1) : 'Active'}</div>
                <div><strong>Role:</strong> {isDriver ? 'Driver' : 'Passenger'}</div>
                {isDriver && (
                  <button className="delete-btn" onClick={async () => {
                    try {
                      await rideService.deleteRide(ride._id);
                      setHistory(history.filter(r => r._id !== ride._id));
                    } catch {
                      alert('Failed to delete ride');
                    }
                  }}>Delete</button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default History;
