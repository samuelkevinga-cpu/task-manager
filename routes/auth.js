const express = require('express');
const passport = require('../config/passport');

const router = express.Router();

// Start Google login.
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google sends the user back here after login.
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failed'
  }),
  (req, res) => {
    res.json({
      message: 'Login successful',
      user: req.user
    });
  }
);

// Show a simple login failure message.
router.get('/failed', (req, res) => {
  res.status(401).json({ message: 'Google login failed' });
});

// Show the current logged-in account.
router.get('/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  res.status(200).json(req.user);
});

// End the current session.
router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    req.session.destroy(() => {
      res.json({ message: 'Logout successful' });
    });
  });
});

module.exports = router;
