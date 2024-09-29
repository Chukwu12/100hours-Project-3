const express = require("express");
const router = express.Router();
const profileController = require('../controllers/profile');
 const { ensureAuth } = require("../middleware/auth");


// Get user profile
router.get("/profile", ensureAuth, profileController.getProfile); // Make sure to create this method in your controller

// Enables user to favorite a recipe
router.post("/recipe/favoriteRecipe/:id", profileController.favoriteRecipe);

//Enables user to like post. In controller, uses POST model to update likes by 1
router.put("/likeRecipe/:id", profileController.likeRecipe);

//Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
router.delete("/deleteRecipe/:id", profileController.deleteRecipe);

// Get user favorites
router.get("/profile", ensureAuth, profileController.getFavorites)

module.exports = router;