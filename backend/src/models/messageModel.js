import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required'],
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Receiver is required'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for efficient chat queries
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, sender: 1, createdAt: -1 });

// Compound index for getting conversation between two users
messageSchema.index({ 
  $or: [
    { sender: 1, receiver: 1 },
    { sender: 1, receiver: 1 }
  ]
});

const Message = mongoose.model('Message', messageSchema);

export default Message;

