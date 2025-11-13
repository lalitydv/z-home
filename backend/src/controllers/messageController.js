import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import { getIO } from '../config/socket.js';
import { logger } from '../utils/logger.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { receiver, message } = req.body;

    // Check if receiver exists
    const receiverDoc = await User.findById(receiver);
    if (!receiverDoc) {
      return res.status(404).json({
        success: false,
        error: 'Receiver not found',
      });
    }

    // Prevent sending message to self
    if (receiver === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot send message to yourself',
      });
    }

    const newMessage = await Message.create({
      sender: req.userId,
      receiver,
      message,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email profileImage')
      .populate('receiver', 'name email profileImage');

    // Emit real-time message via Socket.io
    try {
      const io = getIO();
      io.to(`user:${receiver}`).emit('new:message', populatedMessage);
    } catch (socketError) {
      logger.warn('Socket.io not available:', socketError);
    }

    res.status(201).json({
      success: true,
      data: { message: populatedMessage },
    });
  } catch (error) {
    logger.error('Send message error:', error);
    next(error);
  }
};

export const getChatMessages = async (req, res, next) => {
  try {
    const { receiverId } = req.params;

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        error: 'Receiver not found',
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Get messages between current user and receiver (both directions)
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: receiverId },
        { sender: receiverId, receiver: req.userId },
      ],
    })
      .populate('sender', 'name email profileImage')
      .populate('receiver', 'name email profileImage')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({
      $or: [
        { sender: req.userId, receiver: receiverId },
        { sender: receiverId, receiver: req.userId },
      ],
    });

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get chat messages error:', error);
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    // Get all unique conversations for the current user
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.userId },
            { receiver: req.userId },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.userId] },
              '$receiver',
              '$sender',
            ],
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$sender', req.userId] },
                    { $eq: ['$isRead', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          'user.password': 0,
          'user.refreshToken': 0,
        },
      },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
    ]);

    res.json({
      success: true,
      data: { conversations },
    });
  } catch (error) {
    logger.error('Get conversations error:', error);
    next(error);
  }
};

export const getAllMessages = async (req, res, next) => {
  try {
    // Only admin can access all messages
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.',
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const messages = await Message.find()
      .populate('sender', 'name email profileImage')
      .populate('receiver', 'name email profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments();

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get all messages error:', error);
    next(error);
  }
};

export const getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id)
      .populate('sender', 'name email profileImage')
      .populate('receiver', 'name email profileImage');

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    // Check if user has permission to view this message
    const isSender = message.sender._id.toString() === req.userId.toString();
    const isReceiver = message.receiver._id.toString() === req.userId.toString();
    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

    if (!isSender && !isReceiver && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to view this message',
      });
    }

    res.json({
      success: true,
      data: { message },
    });
  } catch (error) {
    logger.error('Get message by ID error:', error);
    next(error);
  }
};

export const updateMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message: messageText, isRead } = req.body;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    // Check permissions
    const isSender = message.sender.toString() === req.userId.toString();
    const isReceiver = message.receiver.toString() === req.userId.toString();
    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

    // Only sender can edit message content
    if (messageText && !isSender && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Only sender can edit message',
      });
    }

    // Receiver or admin can mark as read
    if (isRead !== undefined && (isReceiver || isAdmin)) {
      message.isRead = isRead;
      if (isRead) {
        message.readAt = new Date();
      } else {
        message.readAt = null;
      }
    }

    // Update message text if provided
    if (messageText && (isSender || isAdmin)) {
      message.message = messageText;
    }

    await message.save();

    const updatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email profileImage')
      .populate('receiver', 'name email profileImage');

    res.json({
      success: true,
      data: { message: updatedMessage },
    });
  } catch (error) {
    logger.error('Update message error:', error);
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    // Check permissions
    const isSender = message.sender.toString() === req.userId.toString();
    const isReceiver = message.receiver.toString() === req.userId.toString();
    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

    if (!isSender && !isReceiver && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this message',
      });
    }

    await Message.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    logger.error('Delete message error:', error);
    next(error);
  }
};

export default {
  sendMessage,
  getChatMessages,
  getConversations,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
};

