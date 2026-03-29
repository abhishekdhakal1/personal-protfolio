const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const validator = require('validator');

const router = express.Router();

// GET all messages (protected - admin only)
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      read, 
      important,
      search 
    } = req.query;
    
    // Build filter
    const filter = {};
    if (read !== undefined) filter.read = read === 'true';
    if (important !== undefined) filter.important = important === 'true';
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const messages = await Message.find(filter)
      .sort({ important: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments(filter);
    const unreadCount = await Message.countDocuments({ read: false });

    res.json({
      messages,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      },
      stats: {
        unread: unreadCount,
        total
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single message (protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Name, email, and message are required' 
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        error: 'Please provide a valid email address' 
      });
    }

    // Create message with client info
    const newMessage = new Message({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim(),
      subject: subject ? subject.trim() : '',
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    await newMessage.save();

    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully! I\'ll get back to you soon.' 
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH mark as read (protected)
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ 
      success: true, 
      message: 'Message marked as read' 
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH toggle important (protected)
router.patch('/:id/important', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.important = !message.important;
    await message.save();

    res.json({ 
      success: true, 
      important: message.important,
      message: `Message marked as ${message.important ? 'important' : 'not important'}` 
    });
  } catch (error) {
    console.error('Toggle important error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE message (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ 
      success: true, 
      message: 'Message deleted successfully' 
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE multiple messages (protected)
router.delete('/', auth, async (req, res) => {
  try {
    const { messageIds } = req.body;
    
    if (!messageIds || !Array.isArray(messageIds)) {
      return res.status(400).json({ 
        error: 'Message IDs array is required' 
      });
    }

    const result = await Message.deleteMany({ 
      _id: { $in: messageIds } 
    });

    res.json({ 
      success: true, 
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} messages deleted successfully` 
    });
  } catch (error) {
    console.error('Delete messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
