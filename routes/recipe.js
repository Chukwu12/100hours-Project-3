const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');


// Route to fetch recipe details by ID
router.get('/recipeInfo/:id', recipeController.getRecipeDetails);

// Route to like a recipe
router.put('/recipe/likeRecipe/:id', recipeController.likeRecipe);

// Route to get favorite recipes
router.get('/recipe/favoriteRecipe/:id', recipeController.favoriteRecipe); // 

// Route to get a recipe by Spoonacular ID
router.get('/recipe/spoonacular/:id', recipeController.getRecipeBySpoonacularId);

module.exports = router;
