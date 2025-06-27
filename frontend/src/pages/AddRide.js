import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import rideService from '../services/rideService';
import { AuthContext } from '../context/AuthContext';

const AddRide = () => {
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seatsAvailable: 1,
    price: 0,
  });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await rideService.addRide({
        from: form.from,
        to: form.to,
        date: form.date, // as string, backend will parse
        time: form.time, // as string (HH:mm)
        availableSeats: Number(form.seatsAvailable),
        price: Number(form.price),
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to add ride');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="auth-container">
      <h2>Add Ride</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="from"
          type="text"
          placeholder="From"
          value={form.from}
          onChange={handleChange}
          required
        />
        <input
          name="to"
          type="text"
          placeholder="To"
          value={form.to}
          onChange={handleChange}
          required
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          name="time"
          type="time"
          value={form.time}
          onChange={handleChange}
          required
        />
        <input
          name="seatsAvailable"
          type="number"
          min="1"
          value={form.seatsAvailable}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          min="0"
          value={form.price}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Ride</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddRide;
