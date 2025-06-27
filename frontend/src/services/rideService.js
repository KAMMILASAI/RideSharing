const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const rideService = {
  getRides: async () => {
    const res = await fetch(`${API_URL}/rides`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },
  addRide: async (ride) => {
    const res = await fetch(`${API_URL}/rides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(ride),
    });
    if (!res.ok) throw new Error('Failed to add ride');
    return await res.json();
  },
  getHistory: async () => {
    const res = await fetch(`${API_URL}/rides/history`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) return [];
    return await res.json();
  },
  requestRide: async (rideId) => {
    const res = await fetch(`${API_URL}/rides/${rideId}/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error('Failed to request ride');
    return await res.json();
  },
  deleteRide: async (rideId) => {
    const res = await fetch(`${API_URL}/rides/${rideId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error('Failed to delete ride');
    return await res.json();
  }
};

export default rideService;
