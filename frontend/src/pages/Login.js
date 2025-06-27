import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await authService.login({ email, password });
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span className="password-eye" onClick={() => setShowPassword(v => !v)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit">Login</button>
        </form>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default Login;
