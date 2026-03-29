const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Web', 'Embedded', 'IoT', 'VLSI', 'AI', 'Other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  githubUrl: {
    type: String,
    trim: true
  },
  demoUrl: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    default: ""
  },
  featured: {
    type: Boolean,
    default: false
  },
  technologies: [{
    name: String,
    level: {
      type: Number,
      min: 1,
      max: 100
    }
  }],
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Planning'],
    default: 'Completed'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
projectSchema.index({ category: 1, featured: -1, order: 1 });
projectSchema.index({ status: 1 });

module.exports = mongoose.model('Project', projectSchema);
