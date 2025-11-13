import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Property price is required'],
    min: [0, 'Price must be positive'],
  },
  propertyType: {
    type: String,
    enum: ['room', 'flat', 'apartment', 'villa'],
    required: [true, 'Property type is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    trim: true,
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: [0, 'Bedrooms must be non-negative'],
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
    min: [0, 'Bathrooms must be non-negative'],
  },
  area: {
    type: Number,
    required: [true, 'Area is required'],
    min: [0, 'Area must be positive'],
  },
  furnished: {
    type: Boolean,
    default: false,
  },
  images: {
    type: [String],
    default: [],
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'sold', 'rented'],
    default: 'available',
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  amenities: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
propertySchema.index({ city: 1, state: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ postedBy: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ createdAt: -1 });

// Compound index for filtering
propertySchema.index({ city: 1, propertyType: 1, price: 1, furnished: 1 });

const Property = mongoose.model('Property', propertySchema);

export default Property;

