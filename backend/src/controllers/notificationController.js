import Notification from '../models/notificationModel.js';
import { logger } from '../utils/logger.js';
import { getIO } from '../config/socket.js';

export const createNotification = async (req, res, next) => {
  try {
    const { user, title, message, type, relatedId, actionUrl } = req.body;

    // Only admin/superadmin can create notifications for other users
    if (user !== req.userId.toString() && !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required to create notifications for other users.',
      });
    }

    const notification = await Notification.create({
      user: user || req.userId,
      title,
      message,
      type,
      relatedId,
      actionUrl,
    });

    // Emit real-time notification via Socket.io
    try {
      const io = getIO();
      io.to(`user:${notification.user}`).emit('new:notification', notification);
    } catch (socketError) {
      logger.warn('Socket.io not available:', socketError);
    }

    res.status(201).json({
      success: true,
      data: { notification },
    });
  } catch (error) {
    logger.error('Create notification error:', error);
    next(error);
  }
};

export const getUserNotifications = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Users can only view their own notifications unless admin
    if (userId !== req.userId.toString() && !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only view your own notifications.',
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { user: userId };

    // Filter by read status if provided
    if (req.query.isRead !== undefined) {
      query.isRead = req.query.isRead === 'true';
    }

    // Filter by type if provided
    if (req.query.type) {
      query.type = req.query.type;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get user notifications error:', error);
    next(error);
  }
};

export const updateNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
      });
    }

    // Check if user owns this notification or is admin
    if (notification.user.toString() !== req.userId.toString() && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this notification',
      });
    }

    if (isRead !== undefined) {
      notification.isRead = isRead;
      if (isRead) {
        notification.readAt = new Date();
      } else {
        notification.readAt = null;
      }
    }

    await notification.save();

    res.json({
      success: true,
      data: { notification },
    });
  } catch (error) {
    logger.error('Update notification error:', error);
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
      });
    }

    // Check if user owns this notification or is admin
    if (notification.user.toString() !== req.userId.toString() && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this notification',
      });
    }

    await Notification.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    logger.error('Delete notification error:', error);
    next(error);
  }
};

export default {
  createNotification,
  getUserNotifications,
  updateNotification,
  deleteNotification,
};

