const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    default: "Electronics, Communication and Information Engineering"
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    default: "Kathmandu, Nepal"
  },
  profileImage: {
    type: String,
    default: ""
  },
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    email: String
  },
  stats: {
    projectsCompleted: {
      type: Number,
      default: 25
    },
    technicalSkills: {
      type: Number,
      default: 15
    },
    yearsExperience: {
      type: Number,
      default: 3
    },
    hoursOfCode: {
      type: Number,
      default: 1000
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save middleware to update updatedAt
profileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
