import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import ChatBox from '../components/ChatBox';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const LiveChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    // Fetch global chat history
    setLoading(true);
    fetch(`${API_URL}/chat/global`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setMessages(data.map(m => {
        const senderName = typeof m.sender === 'object' && m.sender !== null
          ? m.sender.name
          : m.sender;
        return `${senderName}: ${m.content}`;
      })))
      .finally(() => setLoading(false));

    // Connect to Socket.IO
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('joinRoom', { room: 'global' });
    socketRef.current.on('chatMessage', (msg) => {
      const senderName = typeof msg.sender === 'object' && msg.sender !== null
        ? msg.sender.name
        : msg.sender;
      setMessages(prev => [...prev, `${senderName}: ${msg.content}`]);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  const handleSend = (msg) => {
    if (!user) return;
    socketRef.current.emit('chatMessage', {
      sender: user.name, // Always use the user's name
      content: msg
    });
  };

  if (!user) return <p>Please login to use chat.</p>;

  return (
    <div>
      <h2>Live Chat</h2>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <ChatBox messages={messages} onSend={handleSend} />
      )}
    </div>
  );
};

export default LiveChat;
