const User = require('../models/User'); // Adjust the path based on your structure
const bcrypt = require('bcrypt');
//  const passport = require('passport');
 const validator = require('validator');

exports.getLogin = (req, res) => {
    res.render('index', { messages: req.flash('error') }); // Render index.ejs with error messages
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) {
          req.flash('error', 'Invalid email or password.');
          return res.redirect('/login');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
          req.flash('error', 'Invalid email or password.');
          return res.redirect('/login');
      }

      req.login(user, (err) => {
          if (err) {
              return next(err);
          }
          res.redirect('/profile'); // Redirect to profile on success
      });
  } catch (error) {
      console.error('Error during login:', error);
      req.flash('error', 'An error occurred during login. Please try again.');
      res.redirect('/login');
  }
};

exports.getSignup = (req, res) => {
    res.render('index', { messages: req.flash('error') }); // Render index.ejs for signup
};

exports.postSignup = async (req, res) => {
    const { userName, email, password } = req.body;

    // Simple email validation
    if (!userName || !email || !password) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/signup');
  }

  if (!validator.isEmail(email)) {
    req.flash('error', 'Invalid email format.');
    return res.redirect('/signup');
}

if (password.length < 6) {
    req.flash('error', 'Password must be at least 6 characters long.');
    return res.redirect('/signup');
}

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName,
            email,
            password: hashedPassword
        });
        
        await newUser.save();
        req.flash('success_msg', 'Registration successful! You can log in now.');
        res.redirect('/login'); // Redirect to login page after successful signup
    } catch (error) {
        req.flash('error', 'Error during registration. Please try again.');
        res.redirect('/signup'); // Redirect back to signup on error
    }
};

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error logging out:', err);
        }
        req.flash('success_msg', 'You have logged out successfully.');
        res.redirect('/login'); // Redirect to login page after logout
    });
};
