import React, { useEffect, useState, useContext } from 'react';
import notificationService from '../services/notificationService';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Optionally, poll for new notifications
    // const interval = setInterval(fetchNotifications, 10000);
    // return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      setError('Failed to mark as read');
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      await notificationService.handleRequest(requestId, action);
      fetchNotifications();
    } catch (err) {
      setError('Failed to update request');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      fetchNotifications();
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  return (
    <div className="notifications-container">
      <h2>Notifications {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</h2>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((n) => (
            <li key={n._id} className={n.read ? 'read' : 'unread'}>
              <div className="notification-message">{n.message}</div>
              {n.type === 'ride_request' && n.data && n.data.requestId && (n.data.status === 'requested' || typeof n.data.status === 'undefined') && (
                <div className="notification-actions">
                  <button onClick={() => handleRequestAction(n.data.requestId, 'accept')}>Accept</button>
                  <button onClick={() => handleRequestAction(n.data.requestId, 'reject')}>Reject</button>
                </div>
              )}
              {n.type === 'ride_status' && n.data && n.data.rideId && (
                <div className="notification-link">
                  <Link to={`/history`}>View Ride</Link>
                </div>
              )}
              {!n.read && (
                <button className="mark-read-btn" onClick={() => handleMarkAsRead(n._id)}>Mark as read</button>
              )}
              <button className="delete-btn" onClick={() => handleDelete(n._id)}>Delete</button>
              <div className="notification-date">{new Date(n.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
