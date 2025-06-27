import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', phone: '', age: '', address: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          age: data.age || '',
          address: data.address || ''
        });
      } catch (err) {
        setMessage('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser(data.user);
      setMessage('Profile updated!');
    } catch (err) {
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className="auth-container">
      <h2>Profile</h2>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} disabled />
          <input name="phone" type="text" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />
          <input name="address" type="text" placeholder="Address" value={form.address} onChange={handleChange} required />
          <button type="submit">Update Profile</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Profile;
