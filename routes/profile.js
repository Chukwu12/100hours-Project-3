const express = require("express");
const router = express.Router();
const profileController = require('../controllers/profile');
const createController = require("../controllers/create");
 const { ensureAuth } = require("../middleware/auth");



// Get user profile
router.get("/", ensureAuth, profileController.getProfile); // Make sure to create this method in your controller


// Like Recipe
router.put("/likeRecipe/:id", profileController.likeRecipe);


// Delete Recipe
router.delete("/deleteRecipe/:id", ensureAuth, profileController.deleteRecipe);


// Toggle add/remove favorite by Spoonacular ID
router.post("/recipe/favoriteRecipe/:id", ensureAuth, profileController.toggleFavorite);

// Fetch  Triva Questions
router.get('/profile', ensureAuth, createController.foodFacts);


module.exports = router;