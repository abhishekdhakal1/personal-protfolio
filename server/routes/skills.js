const express = require('express');
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

const router = express.Router();

// GET all skills
router.get('/', async (req, res) => {
  try {
    const { category, visible } = req.query;
    
    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (visible !== undefined) filter.visible = visible === 'true';

    const skills = await Skill.find(filter)
      .sort({ category: 1, order: 1, name: 1 });

    // Group by category
    const groupedSkills = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});

    res.json({ 
      skills: groupedSkills,
      allSkills: skills
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single skill
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json({ skill });
  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create skill (protected)
router.post('/', auth, async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();

    res.status(201).json({ 
      success: true, 
      skill,
      message: 'Skill created successfully' 
    });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update skill (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json({ 
      success: true, 
      skill,
      message: 'Skill updated successfully' 
    });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE skill (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json({ 
      success: true, 
      message: 'Skill deleted successfully' 
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle visibility
router.patch('/:id/visible', auth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    skill.visible = !skill.visible;
    await skill.save();

    res.json({ 
      success: true, 
      visible: skill.visible,
      message: `Skill ${skill.visible ? 'shown' : 'hidden'} successfully` 
    });
  } catch (error) {
    console.error('Toggle visibility error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reorder skills
router.patch('/reorder', auth, async (req, res) => {
  try {
    const { skills } = req.body; // Array of {id, order}
    
    const updatePromises = skills.map(({ id, order }) =>
      Skill.findByIdAndUpdate(id, { order })
    );

    await Promise.all(updatePromises);

    res.json({ 
      success: true, 
      message: 'Skills reordered successfully' 
    });
  } catch (error) {
    console.error('Reorder skills error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
