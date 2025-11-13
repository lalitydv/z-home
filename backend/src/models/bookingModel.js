import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required'],
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Indexes
bookingSchema.index({ property: 1 });
bookingSchema.index({ buyer: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

// Compound index
bookingSchema.index({ buyer: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;

