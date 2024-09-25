// routes/home.js
const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home');
 const authController = require("../controllers/auth");
const profileController = require("../controllers/profile");
const mainController = require("../controllers/main");
  const { ensureAuth } = require("../middleware/auth");
  const passport = require('passport'); // Import passport



// Log the imported controllers to check for any issues
// console.log(homeController, authController, profileController, mainController);
// console.log('Home Controller:', homeController);
// console.log('Auth Controller:', authController);
// console.log('Main Controller:', mainController);


// Home Route
router.get('/', homeController.getIndex);

// Profile Route
router.get("/profile", profileController.getProfile);

// Recipe Route - Combined Data
router.get("/main", mainController.combinedData); // Ensure the user is authenticated


// Login Routes
router.get("/login", authController.getLogin);

// Updated POST /login route with detailed error handling
router.post("/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error('Authentication error:', err);
        return next(err); // Pass errors to the next middleware
      }
      if (!user) {
        console.log('Login failed:', info.message);
        return res.redirect('/login'); // Redirect back to login on failure
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return next(err);
        }
        return res.redirect('/recipe'); // Redirect to profile after successful login
      });
    })(req, res, next);
  });

// Logout Route
 router.get("/logout", authController.logout);

// Signup Routes
 router.get("/signup", authController.getSignup);
 router.post("/signup", authController.postSignup);

module.exports = router