const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * Identifies the acting account via x-user-id header.
 * Week 04 OAuth can replace this with the session user.
 */
const requireUser = async (req, res, next) => {
  try {
    const userId = req.header('x-user-id');

    if (!userId) {
      return res.status(401).json({
        message: 'Missing x-user-id header. Send your user _id to act as that account.'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid x-user-id' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found for x-user-id' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Failed to authenticate user', error: error.message });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin role required to delete users' });
  }

  next();
};

module.exports = {
  requireUser,
  requireAdmin
};
