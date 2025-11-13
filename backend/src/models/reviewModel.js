import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5'],
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
  },
}, {
  timestamps: true,
});

// Indexes
reviewSchema.index({ property: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ createdAt: -1 });

// Prevent duplicate reviews from same user for same property
reviewSchema.index({ property: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;

