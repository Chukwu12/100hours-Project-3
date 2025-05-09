const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');





// router.get('/', recipeController.getRandomRecipes); 

// Route to fetch recipe details by ID
router.get('/recipeInfo/:id', recipeController.getRecipeDetails);

// Route to like a recipe
router.put('/likeRecipe/:id', recipeController.likeRecipe);

// Route to get favorite recipes
router.post('/favoriteRecipe/:id', recipeController.favoriteRecipe);

// Route to get a recipe by Spoonacular ID
router.get('/recipe/spoonacular/:id', recipeController.getRecipeBySpoonacularId);

//Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
// router.delete("/deleteRecipe/:id", recipesController.deleteRecipe);

// Endpoint to send the API Key to the client
router.get('/api-key', (req, res) => {
    res.json({ apiKey: process.env.RECIPES_API_KEY });
});
   

module.exports = router;
