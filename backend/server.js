const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ridesharing';

// Middleware
app.use(cors({ origin: 'https://ridesharing-version-1.netlify.app', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rides', require('./routes/ride'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/test', require('./routes/test'));
app.use('/api/chat', require('./routes/chat'));

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    // Socket.IO setup
    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    const io = require('socket.io')(server, {
      cors: { origin: 'https://ridesharing-version-1.netlify.app', methods: ['GET', 'POST'] }
    });
    require('./sockets/chatSocket')(io);

    // Auto-delete messages older than 12 hours every hour
    const Message = require('./models/Message');
    setInterval(async () => {
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
      await Message.deleteMany({ createdAt: { $lt: twelveHoursAgo } });
    }, 60 * 60 * 1000);
  })
  .catch(err => console.error('MongoDB connection error:', err));
