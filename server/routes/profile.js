const express = require('express');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, publicIdFromUrl } = require('../config/cloudinary');

const router = express.Router();

// Store profile photos on Cloudinary (persists across redeploys) and crop
// every upload to a consistent square so it always "covers" its frame.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/profile',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'fill', gravity: 'face' }],
  },
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

    // Multipart fields arrive as strings — parse the nested JSON objects back
    if (typeof updateData.socialLinks === 'string') {
      try { updateData.socialLinks = JSON.parse(updateData.socialLinks); } catch { delete updateData.socialLinks; }
    }
    if (typeof updateData.stats === 'string') {
      try { updateData.stats = JSON.parse(updateData.stats); } catch { delete updateData.stats; }
    }

    // Handle profile image upload — replace the previous Cloudinary asset, if any
    if (req.file) {
      const existing = await Profile.findOne();
      const oldPublicId = existing?.profileImage && publicIdFromUrl(existing.profileImage);
      if (oldPublicId) cloudinary.uploader.destroy(oldPublicId).catch(() => {});
      updateData.profileImage = req.file.path;
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
      const publicId = publicIdFromUrl(profile.profileImage);
      if (publicId) await cloudinary.uploader.destroy(publicId).catch(() => {});
      
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
