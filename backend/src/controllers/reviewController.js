import Review from '../models/reviewModel.js';
import Property from '../models/propertyModel.js';
import { logger } from '../utils/logger.js';

export const addReview = async (req, res, next) => {
  try {
    const { property, rating, comment } = req.body;

    // Check if property exists
    const propertyDoc = await Property.findById(property);
    if (!propertyDoc) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    // Check if user already reviewed this property
    const existingReview = await Review.findOne({
      property,
      user: req.userId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this property',
      });
    }

    const review = await Review.create({
      property,
      user: req.userId,
      rating,
      comment,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name email profileImage')
      .populate('property', 'title');

    res.status(201).json({
      success: true,
      data: { review: populatedReview },
    });
  } catch (error) {
    logger.error('Add review error:', error);
    next(error);
  }
};

export const getPropertyReviews = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ property: propertyId })
      .populate('user', 'name email profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ property: propertyId });

    // Calculate average rating
    const avgRatingResult = await Review.aggregate([
      { $match: { property: property._id } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);

    const avgRating = avgRatingResult.length > 0 
      ? avgRatingResult[0].avgRating.toFixed(1) 
      : 0;

    res.json({
      success: true,
      data: {
        reviews,
        averageRating: parseFloat(avgRating),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get property reviews error:', error);
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    // Check if user is the review owner
    if (review.user.toString() !== req.userId.toString() && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this review',
      });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate('user', 'name email profileImage')
      .populate('property', 'title');

    res.json({
      success: true,
      data: { review: updatedReview },
    });
  } catch (error) {
    logger.error('Update review error:', error);
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    // Check if user is the review owner or admin
    if (review.user.toString() !== req.userId.toString() && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this review',
      });
    }

    await Review.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    logger.error('Delete review error:', error);
    next(error);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    
    // Filter by property if provided
    if (req.query.property) {
      query.property = req.query.property;
    }

    const reviews = await Review.find(query)
      .populate('user', 'name email profileImage')
      .populate('property', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get all reviews error:', error);
    next(error);
  }
};

export const getReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate('user', 'name email profileImage')
      .populate('property', 'title location city');

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    res.json({
      success: true,
      data: { review },
    });
  } catch (error) {
    logger.error('Get review by ID error:', error);
    next(error);
  }
};

export default {
  addReview,
  getPropertyReviews,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};

