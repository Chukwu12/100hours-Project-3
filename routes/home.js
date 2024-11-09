// routes/home.js
const express = require('express')
const router = express.Router()
const authController = require("../controllers/auth");
const homeController = require('../controllers/home');
const profileController = require("../controllers/profile");
const mainController = require("../controllers/main");
  const { ensureAuth } = require("../middleware/auth");
 



// Log the imported controllers to check for any issues
// console.log(homeController, authController, profileController, mainController);
// console.log('Home Controller:', homeController);
// console.log('Auth Controller:', authController);
// console.log('Main Controller:', mainController);


// Home Route
router.get('/', homeController.getIndex);

// Profile Route
router.get("/profile", ensureAuth, profileController.getProfile);
  // console.log('User:', req.user); // Log the user object


// Recipe Route - Combined Data
router.get("/main", mainController.combinedData); // Ensure the user is authenticated

router.get("/favorites", ensureAuth, profileController.getFavorites);

// Login Routes
router.get("/login", authController.getLogin);

// Updated POST /login route with detailed error handling
router.post("/login", authController.postLogin);

// Logout Route
 router.get("/logout", authController.logout);

// Signup Routes
 router.get("/signup", authController.getSignup);
 router.post("/signup", authController.postSignup);

module.exports = router