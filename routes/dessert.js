// routes/recipe.js
const express = require('express');
const router = express.Router();
const dessertController = require('../controllers/dessert');


// Routes for random recipes
  router.get('/', dessertController.getDessertRecipes); // Route to fetch random recipes
  //router.get('/recipe/:id', recipeController.getRecipeDetails); // Route to fetch recipeInfo from the ID 


module.exports = router;
