const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  subject: {
    type: String,
    trim: true,
    maxlength: 200
  },
  read: {
    type: Boolean,
    default: false
  },
  important: {
    type: Boolean,
    default: false
  },
  ip: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better query performance
messageSchema.index({ read: 1, createdAt: -1 });
messageSchema.index({ important: -1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
