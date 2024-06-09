// routes/recipe.js
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');



 router.get('/', recipeController.getRandomRecipes); // Route to fetch random recipes
router.get('/view', recipeController.viewRecipes); // Route to render the recipe page

module.exports = router;
