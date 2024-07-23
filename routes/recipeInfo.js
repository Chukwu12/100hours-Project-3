const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');

// Route for fetching random recipes
router.get('/recipe', recipeController.getRandomRecipes);

// Route for fetching specific recipe details
router.get('/recipe/:id', recipeController.getRecipeDetails);

module.exports = router;
