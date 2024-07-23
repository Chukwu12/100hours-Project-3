// routes/recipe.js
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');


// Routes for random recipes
 router.get('/recipe', recipeController.getRandomRecipes); // Route to fetch random recipes
 router.get('/recipe/:id', recipeController.getRecipeDetails); // Route to fetch recipeInfo from the ID 
router.get('/view', recipeController.viewRecipes); // Route to render the recipe page

module.exports = router;
