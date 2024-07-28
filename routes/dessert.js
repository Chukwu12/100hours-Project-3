// routes/recipe.js
const express = require('express');
const router = express.Router();
const dessertController = require('../controllers/dessert');


// Routes for random recipes
 router.get('/dessert', dessertController.getDessertRecipes); // Route to fetch random recipes
//  router.get('/recipe/:id', recipeController.getRecipeDetails); // Route to fetch recipeInfo from the ID 
router.get('/view', dessertController.viewDessertRecipes); // Route to render the recipe page

module.exports = router;
