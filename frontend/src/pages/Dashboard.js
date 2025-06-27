import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import rideService from '../services/rideService';
import { AuthContext } from '../context/AuthContext';
import RideCard from '../components/RideCard';
import './Dashboard.css';

const Dashboard = () => {
  const [rides, setRides] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchRides = async () => {
      try {
        setIsLoading(true);
        const data = await rideService.getRides();
        setRides(Array.isArray(data) ? data : []);
      } catch (err) {
        setMessage('Failed to load rides. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRides();
  }, [user, navigate]);

  const handleRequest = async (ride) => {
    try {
      await rideService.requestRide(ride._id || ride.id);
      setMessage('Request sent successfully!');
    } catch (err) {
      setMessage('Failed to send request.');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const refreshRides = async () => {
    try {
      setIsLoading(true);
      const data = await rideService.getRides();
      setRides(Array.isArray(data) ? data : []);
      setMessage('Rides refreshed!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to refresh rides.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        
      </div>

      {message && (
        <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : rides.length === 0 ? (
        <p className="no-rides">No rides available at the moment.</p>
      ) : (
        <div className="rides-grid">
          {rides.map(ride => (
            <RideCard 
              key={ride._id} 
              ride={ride} 
              onRequest={handleRequest} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;