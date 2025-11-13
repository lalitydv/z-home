import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  phone: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'broker', 'admin', 'superadmin'],
    default: 'buyer',
  },
  profileImage: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
  bio: {
    type: String,
    trim: true,
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
  },
}, {
  timestamps: true,
});

// Indexes (email already has unique index from unique: true)
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Ensure password is not returned in JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

export default User;

