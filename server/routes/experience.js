const express = require('express');
const Experience = require('../models/Experience');
const auth = require('../middleware/auth');

const router = express.Router();

// GET all experiences (public)
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find()
      .sort({ current: -1, startDate: -1 });
    res.json({ experiences });
  } catch (err) {
    console.error('Get experience error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single (public)
router.get('/:id', async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ error: 'Not found' });
    res.json({ experience: exp });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create (protected)
router.post('/', auth, async (req, res) => {
  try {
    const exp = new Experience(req.body);
    await exp.save();
    res.status(201).json({ success: true, experience: exp });
  } catch (err) {
    console.error('Create experience error:', err);
    res.status(400).json({ error: err.message ?? 'Server error' });
  }
});

// PUT update (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const exp = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!exp) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, experience: exp });
  } catch (err) {
    res.status(400).json({ error: err.message ?? 'Server error' });
  }
});

// DELETE (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
