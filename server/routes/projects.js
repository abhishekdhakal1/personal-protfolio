const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, publicIdFromUrl } = require('../config/cloudinary');

const router = express.Router();

// Multipart fields arrive as strings — coerce tags/featured back to their real types
function parseProjectBody(body) {
  const data = { ...body };
  if (typeof data.tags === 'string') {
    try { data.tags = JSON.parse(data.tags); } catch { data.tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean); }
  }
  if (typeof data.featured === 'string') data.featured = data.featured === 'true';
  return data;
}

// Store project images on Cloudinary (persists across redeploys) and crop
// every upload to a consistent 16:9 frame so it always "covers" its thumbnail/banner.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 675, crop: 'fill', gravity: 'auto' }],
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

// GET all projects
router.get('/', async (req, res) => {
  try {
    const { category, featured, status, page = 1, limit = 10 } = req.query;
    
    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (status) filter.status = status;

    // Build query
    const query = Project.find(filter)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const projects = await query;
    const total = await Project.countDocuments(filter);

    res.json({
      projects,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create project (protected)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const projectData = parseProjectBody(req.body);

    // Handle image upload
    if (req.file) {
      projectData.imageUrl = req.file.path;
    }

    const project = new Project(projectData);
    await project.save();

    res.status(201).json({ 
      success: true, 
      project,
      message: 'Project created successfully' 
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update project (protected)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const projectData = parseProjectBody(req.body);

    // Handle image upload — replace the previous Cloudinary asset, if any
    if (req.file) {
      const existing = await Project.findById(req.params.id);
      const oldPublicId = existing?.imageUrl && publicIdFromUrl(existing.imageUrl);
      if (oldPublicId) cloudinary.uploader.destroy(oldPublicId).catch(() => {});
      projectData.imageUrl = req.file.path;
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      projectData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ 
      success: true, 
      project,
      message: 'Project updated successfully' 
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE project (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete associated image file
    if (project.imageUrl) {
      const publicId = publicIdFromUrl(project.imageUrl);
      if (publicId) await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    res.json({ 
      success: true, 
      message: 'Project deleted successfully' 
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle featured status
router.patch('/:id/featured', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.featured = !project.featured;
    await project.save();

    res.json({ 
      success: true, 
      featured: project.featured,
      message: `Project ${project.featured ? 'featured' : 'unfeatured'} successfully` 
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
