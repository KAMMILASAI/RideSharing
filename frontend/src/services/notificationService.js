const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const notificationService = {
  getNotifications: async () => {
    const res = await fetch(`${API_URL}/notifications`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return await res.json();
  },
  markAsRead: async (id) => {
    const res = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error('Failed to mark as read');
    return await res.json();
  },
  handleRequest: async (requestId, action) => {
    // action: 'accept' or 'reject'
    const res = await fetch(`${API_URL}/notifications/request/${requestId}/${action}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error('Failed to update request');
    return await res.json();
  },
  deleteNotification: async (id) => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) throw new Error('Failed to delete notification');
    return await res.json();
  }
};

export default notificationService;
