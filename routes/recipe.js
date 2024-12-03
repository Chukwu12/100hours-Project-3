const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');


// router.get('/', recipeController.getRandomRecipes); 

// Route to fetch recipe details by ID
router.get('/recipeInfo/:id', recipeController.getRecipeDetails);

// Route to mark a recipe as favorite
router.post('/favoriteRecipe/:id', recipeController.favoriteRecipe);

// Route to like a recipe
router.put('/likeRecipe/:id', recipeController.likeRecipe);

// Route to get favorite recipes
router.get('/recipe/favoriteRecipe/:id', recipeController.favoriteRecipe); // 

// Route to get a recipe by Spoonacular ID
router.get('/recipe/spoonacular/:id', recipeController.getRecipeBySpoonacularId);

//Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
// router.delete("/deleteRecipe/:id", recipesController.deleteRecipe);

//Fetch Random Wine parried with Dish 
 router.get('/recipe', recipeController.getRandomWinePairingAndDescription);

module.exports = router;
