const express = require('express');
const router = express.Router();
const axios = require('axios');


const recipeController = require('../controllers/recipe');
const recipeInfoController = require('../controllers/recipeInfo');

// Route for fetching random recipes
router.get('/recipe', recipeController.getRandomRecipes);

// Route for fetching specific recipe details
router.get('/recipe/:id', recipeController.getRecipeDetails);

router.get('/:id', recipeInfoController.getRecipeDetails);


module.exports = router;
