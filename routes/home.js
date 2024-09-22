// routes/home.js
const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home');
const authController = require("../controllers/auth");
const profileController = require("../controllers/profile");
const mainController = require("../controllers/main");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Home Route
router.get('/', homeController.getIndex) 
// Profile Route
router.get("/profile", profileController.getProfile);

//Favorite Route
router.get("/favorites", ensureAuth, profileController.getFavorites);

// Login Routes
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

// Logout Route
router.get("/logout", authController.logout);

// Signup Routes
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

// Recipe Route - Protected
// router.get("/recipe", ensureAuth, mainController.combinedData);


module.exports = router