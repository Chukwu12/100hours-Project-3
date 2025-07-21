const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');
const searchController = require('../controllers/search');


// Load environment variable
require('dotenv').config();


// Endpoint to send the API Key to the client
router.get('/api-key', searchController.getApiKey);

// router.get('/', recipeController.getRandomRecipes); 

// Route to fetch items from SearchBar
// router.get('/recipes/:id/information', recipeController.getRecipeDetails);

// Route to fetch recipe details by ID
router.get('/:id', recipeController.getRecipeDetails);

// Route to like a recipe
router.put('/likeRecipe/:id', recipeController.likeRecipe);

// Route to get favorite recipes
router.post('/favoriteRecipe/:id', recipeController.favoriteRecipe);

// Route to get a recipe by Spoonacular ID
router.get('/recipe/spoonacular/:id', recipeController.getRecipeBySpoonacularId);

//Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
router.delete('/recipe/favoriteRecipe/:id', recipeController.deleteFavoriteRecipe);


module.exports = router;
