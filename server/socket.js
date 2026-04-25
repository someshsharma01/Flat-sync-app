const { Server } = require('socket.io');

let io;
const onlineUsers = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId && userId !== 'undefined') {
      onlineUsers.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ${socket.id}`);
    }

    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('send_message', async (data) => {
      // data: { roomId, senderId, receiverId, text }
      try {
        const Message = require('./models/Message');
        const newMessage = await Message.create({
          roomId: data.roomId,
          senderId: data.senderId,
          receiverId: data.receiverId,
          text: data.text
        });

        // Emit to the room
        io.to(data.roomId).emit('receive_message', newMessage);
      } catch (error) {
        console.error('Socket send_message error:', error);
      }
    });

    socket.on('request_notification', ({ toUserId, notification }) => {
      const receiverSocketId = onlineUsers.get(toUserId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('incoming_request', notification);
      }
    });

    socket.on('disconnect', () => {
      if (userId) {
        onlineUsers.delete(userId);
      }
      console.log('User disconnected:', socket.id);
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

const getOnlineUsers = () => onlineUsers;

module.exports = { initSocket, getIo, getOnlineUsers };