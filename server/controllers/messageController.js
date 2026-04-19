const Message = require('../models/Message');

const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const saveMessage = async (req, res) => {
  try {
    const { roomId, senderId, receiverId, text } = req.body;
    const message = await Message.create({ roomId, senderId, receiverId, text });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMessages, saveMessage };
