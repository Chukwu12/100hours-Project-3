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
console.log('Home Controller:', homeController);
console.log('Auth Controller:', authController);
console.log('Main Controller:', mainController);




// Home Route
router.get('/', homeController.getIndex);

// Profile Route
router.get("/profile",ensureAuth, profileController.getProfile);

// Recipe Route - Combined Data
router.get("/main", ensureAuth, mainController.combinedData); // Ensure the user is authenticated

// Login Routes
router.get("/login", authController.getLogin);
router.post("/login", passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));


// Logout Route
router.get("/logout", authController.logout);

// Signup Routes
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router