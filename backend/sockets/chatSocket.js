const Message = require('../models/Message');
const User = require('../models/User');

function chatSocket(io) {
  io.on('connection', (socket) => {
    // Join the global chat room
    socket.join('global');

    // Handle sending a chat message
    socket.on('chatMessage', async ({ sender, content }) => {
      if (!sender || !content) return;
      try {
        // Look up the user by name and get their ObjectId
        const user = await User.findOne({ name: sender });
        if (!user) {
          socket.emit('error', { message: 'Sender not found' });
          return;
        }
        const message = new Message({
          ride: null, // global chat
          sender: user._id,
          receiver: null,
          content,
        });
        await message.save();
        // Populate sender with name before emitting
        const populatedMessage = await Message.findById(message._id).populate('sender', 'name');
        io.to('global').emit('chatMessage', {
          ...populatedMessage.toObject(),
          sender: (populatedMessage.sender && populatedMessage.sender.name) ? populatedMessage.sender.name : String(populatedMessage.sender)
        });
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message', error: err.message });
      }
    });
  });
}

module.exports = chatSocket;
