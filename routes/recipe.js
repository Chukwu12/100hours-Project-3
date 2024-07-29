// routes/recipe.js
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');


// Routes for random recipes
 router.get('/', recipeController.getRandomRecipes); // Route to fetch random recipes
 router.get('/recipe/:id', recipeController.getRecipeDetails); // Route to fetch recipeInfo from the ID 
router.get('/view', recipeController.viewRecipes); // Route to render the recipe page

router.post("/favoriteRecipe/:id", recipeController.favoriteRecipe);
router.put("/likeRecipe/:id", recipeController.likeRecipe);//Enables user to like post. In controller, uses POST model to update likes by 1
router.delete("/deleteRecipe/:id", recipeController.deleteRecipe);//Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection

module.exports = router;
