// routes/recipe.js
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');
const healthyController = require('../controllers/healthy');


// Routes for random recipes
 router.get('/', recipeController.getRandomRecipes); // Route to fetch random recipes
router.get('/view', recipeController.viewRecipes); // Route to render the recipe page

// Routes for healthy recipes
router.get('/', healthyController.getHealthRecipes); // Route to healthy random  recipes
router.get('/view', healthyController.viewHealthRecipes); // Route to render the recipe

module.exports = router;
