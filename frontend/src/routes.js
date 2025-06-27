import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddRide from './pages/AddRide';
import History from './pages/History';
import LiveChat from './pages/LiveChat';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/add-ride" element={<AddRide />} />
    <Route path="/history" element={<History />} />
    <Route path="/live-chat" element={<LiveChat />} />
    <Route path="/notifications" element={<Notifications />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
);

export default AppRoutes;
