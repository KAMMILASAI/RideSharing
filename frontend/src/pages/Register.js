import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', age: '', address: '', password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await authService.register(form);
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="phone" type="text" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />
          <input name="address" type="text" placeholder="Address" value={form.address} onChange={handleChange} required />
          <div className="password-input-wrapper">
            <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={handleChange} required />
            <span className="password-eye" onClick={() => setShowPassword(v => !v)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit">Register</button>
        </form>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;