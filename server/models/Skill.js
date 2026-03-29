const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'Embedded Systems', 'VLSI & FPGA', 'AI & ML', 'IoT & Networks', 'Cloud & DevOps']
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  icon: {
    type: String,
    default: "Code"
  },
  color: {
    type: String,
    default: "from-cyan-500 to-blue-500"
  },
  description: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  visible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
skillSchema.index({ category: 1, order: 1, visible: -1 });

module.exports = mongoose.model('Skill', skillSchema);
