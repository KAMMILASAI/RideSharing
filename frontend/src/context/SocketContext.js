import React, { createContext } from 'react';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children, socket }) => (
  <SocketContext.Provider value={socket}>
    {children}
  </SocketContext.Provider>
);
