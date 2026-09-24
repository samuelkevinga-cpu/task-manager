const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Tell Passport how to find a logged-in user.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Tell Passport how to restore a logged-in user.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Create or find the user after Google login.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const firstName = profile.name?.givenName || 'Google';
        const lastName = profile.name?.familyName || 'User';

        // Find the account by Google id or email.
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }]
        });

        if (!user) {
          // Create a normal user on the first login.
          user = await User.create({
            googleId: profile.id,
            firstName,
            lastName,
            email,
            role: 'user'
          });
        } else {
          // Link the existing account and keep its role.
          user.googleId = profile.id;
          user.firstName = firstName;
          user.lastName = lastName;
          user.email = email;
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = passport;
