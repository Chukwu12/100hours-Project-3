const LocalStrategy = require('passport-local').Strategy
// const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          console.log('Login failed: User not found');
            return done(null, false, { msg: `Email ${email} not found.` });
        }
        if (!user.password) {
          console.log('Login failed: No password set for account');
            return done(null, false, { msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' });
        }

        const isMatch = await user.comparePassword(password);
        if (isMatch) {
            return done(null, user);
        } else {
          console.log('Login failed: Invalid password');
            return done(null, false, { msg: 'Invalid email or password.' });
        }
    } catch (err) {
      console.error('Error during login:', err);
        return done(err);
    }
}));
  

  passport.serializeUser((user, done) => {
    done(null, user.id) // Store user ID in session
  })

  passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user); // Attach user object to req.user
    } catch (err) {
        done(err);
    }
});
}
