import { uploadToS3, deleteFromS3, getS3Url } from '../services/storage.service.js';
import { logger } from '../utils/logger.js';

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided',
      });
    }

    const { originalname, mimetype, buffer } = req.file;
    const userId = req.userId;

    // Generate unique file key
    const fileExtension = originalname.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // Upload to S3
    const result = await uploadToS3(fileName, buffer, mimetype);

    res.json({
      success: true,
      data: {
        fileKey: fileName,
        url: result.Location,
        size: buffer.length,
        mimetype,
      },
    });
  } catch (error) {
    logger.error('File upload error:', error);
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const { fileKey } = req.params;
    const userId = req.userId;

    // Verify file belongs to user
    if (!fileKey.startsWith(`${userId}/`)) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized to delete this file',
      });
    }

    await deleteFromS3(fileKey);

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    logger.error('File delete error:', error);
    next(error);
  }
};

export const getFileUrl = async (req, res, next) => {
  try {
    const { fileKey } = req.params;
    const expiresIn = parseInt(req.query.expiresIn) || 3600; // Default 1 hour

    const url = await getS3Url(fileKey, expiresIn);

    res.json({
      success: true,
      data: {
        url,
        expiresIn,
      },
    });
  } catch (error) {
    logger.error('Get file URL error:', error);
    next(error);
  }
};

