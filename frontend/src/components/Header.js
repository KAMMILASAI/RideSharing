import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBars, FaUser, FaTimes, FaPlus, FaHistory, FaBell, FaComments, FaSignOutAlt } from 'react-icons/fa';
import ProfilePopup from './ProfilePopup';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <h1>
            <Link to="/dashboard" className="logo-link">RideSharing</Link>
          </h1>
        </div>

        {user && (
          <div className="header-right" ref={menuRef}>
            {/* Desktop Navigation */}
            <div className="desktop-nav">
              <Link to="/add-ride" className="nav-link">
                <FaPlus className="nav-icon" /> Add Ride
              </Link>
              <Link to="/history" className="nav-link">
                <FaHistory className="nav-icon" /> History
              </Link>
              <Link to="/notifications" className="nav-link">
                <FaBell className="nav-icon" /> Notifications
              </Link>
              <Link to="/live-chat" className="nav-link">
                <FaComments className="nav-icon" /> Live Chat
              </Link>
              <button className="profile-icon-btn" onClick={() => setShowProfile(true)} title="Profile">
                <FaUser className="nav-icon" />
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="nav-icon" /> Logout
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="mobile-controls">
              <button className="profile-icon-btn" onClick={() => setShowProfile(true)} title="Profile">
                <FaUser />
              </button>
              <button className="menu-toggle" onClick={toggleMenu}>
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
              <h12></h12><h1></h1>
            </div>
            {showProfile && (
              <>
                <div className="profile-popup-overlay" onClick={() => setShowProfile(false)} />
                <ProfilePopup user={user} onClose={() => setShowProfile(false)} />
              </>
            )}

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
              <div className="mobile-menu-header">
                <h2>Menu</h2>
                <button className="close-menu" onClick={toggleMenu}>
                  <FaTimes />
                </button>
              </div>
              <div className="mobile-menu-content">
                <Link to="/add-ride" className="mobile-nav-link" onClick={toggleMenu}>
                  <FaPlus className="nav-icon" /> Add Ride
                </Link>
                <Link to="/history" className="mobile-nav-link" onClick={toggleMenu}>
                  <FaHistory className="nav-icon" /> History
                </Link>
                <Link to="/notifications" className="mobile-nav-link" onClick={toggleMenu}>
                  <FaBell className="nav-icon" /> Notifications
                </Link>
                <Link to="/live-chat" className="mobile-nav-link" onClick={toggleMenu}>
                  <FaComments className="nav-icon" /> Live Chat
                </Link>
                <Link to="/profile" className="mobile-nav-link" onClick={toggleMenu}>
                  <FaUser className="nav-icon" /> Profile
                </Link>
                <button className="mobile-logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt className="nav-icon" /> Logout
                </button>
              </div>
            </div>

            {/* Overlay */}
            <div 
              className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} 
              onClick={toggleMenu}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;