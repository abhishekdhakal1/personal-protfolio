const express = require('express');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET profile
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    
    // If no profile exists, create default one
    if (!profile) {
      profile = new Profile({
        name: "Abhishek Dhakal",
        bio: "Passionate Electronics and Communication Engineering student focused on bridging hardware and software systems.",
        email: "abhishekdhakal1826@gmail.com",
        phone: "+977 9824230483",
        location: "Kathmandu, Nepal"
      });
      await profile.save();
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT/UPDATE profile (protected)
router.put('/', auth, upload.single('profileImage'), async (req, res) => {
  try {
    const updateData = req.body;
    
    // Handle profile image upload
    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    // Update profile
    const profile = await Profile.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ 
      success: true, 
      profile,
      message: 'Profile updated successfully' 
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE profile image
router.delete('/image', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne();
    
    if (profile && profile.profileImage) {
      const imagePath = path.join(__dirname, '..', profile.profileImage);
      
      // Delete file if it exists
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      
      // Update profile to remove image reference
      profile.profileImage = "";
      await profile.save();
    }

    res.json({ 
      success: true, 
      message: 'Profile image deleted successfully' 
    });

  } catch (error) {
    console.error('Delete profile image error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
