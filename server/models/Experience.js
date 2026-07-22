const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract'],
    default: 'Full-time',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    trim: true,
  },
  skills: [{
    type: String,
    trim: true,
  }],
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

experienceSchema.index({ current: -1, startDate: -1 });

module.exports = mongoose.model('Experience', experienceSchema);
