const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      // Find user by email (case-insensitive)
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        return done(null, false, { msg: `Email ${email} not found.` });
      }

      // Check if the password matches
      const isMatch = await user.comparePassword(password);

      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { msg: 'Invalid email or password.' });
      }
    } catch (err) {
      console.error('Error during login:', err);
      return done(err);  // Handle any errors during login
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);  // Store user ID in session
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);  // Attach user object to req.user
    } catch (err) {
      done(err);
    }
  });
};
