// Require a user who logged in with Google.
const requireUser = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Please log in with Google first' });
  }

  next();
};

// Only an admin can delete another user.
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
