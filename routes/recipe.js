// routes/recipe.js
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');

// Route to fetch recipe details by ID
router.get('/recipeInfo/:id', recipeController.getRecipeDetails);

// Route to mark a recipe as favorite
router.post('/favoriteRecipe/:id', recipeController.favoriteRecipe);

// Route to like a recipe
router.put('/likeRecipe/:id', recipeController.likeRecipe);

// Route to delete a recipe
router.delete('/deleteRecipe/:id', recipeController.deleteRecipe);

module.exports = router;
