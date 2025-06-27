import React, { createContext, useContext, useEffect, useState } from 'react';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationService.getNotifications();
      setUnreadCount(data.unreadCount || 0);
    } catch {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{ unreadCount, fetchUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
