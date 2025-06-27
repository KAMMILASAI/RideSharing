const API_URL = process.env.REACT_APP_API_URL || 'https://ridesharingbackend.onrender.com/api';

const authService = {
  login: async (credentials) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('token', data.token);
    return data.user;
  },
  register: async (data) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Registration failed');
    localStorage.setItem('token', result.token);
    return result.user;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

export default authService;
