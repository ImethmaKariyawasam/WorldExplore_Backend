const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get current user's profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Add country to favorites
router.post('/favorites/:countryCode', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Check if already favorited
    if (user.favoriteCountries.includes(req.params.countryCode)) {
      return res.status(400).json({ error: 'Country already in favorites' });
    }

    // Add to favorites
    user.favoriteCountries.push(req.params.countryCode);
    await user.save();
    
    res.json({
      success: true,
      favorites: user.favoriteCountries
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Remove country from favorites
router.delete('/favorites/:countryCode', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Remove from favorites
    user.favoriteCountries = user.favoriteCountries.filter(
      code => code !== req.params.countryCode
    );
    
    await user.save();
    res.json({
      success: true,
      favorites: user.favoriteCountries
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// Get all favorites
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('favoriteCountries');
    res.json(user.favoriteCountries);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

module.exports = router;