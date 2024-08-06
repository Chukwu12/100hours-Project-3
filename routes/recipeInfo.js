const express = require('express');
const router = express.Router();
const { getHealthRecipes } = require ('../controllers/health');


const recipeController = require('../controllers/recipe');
const recipeInfoController = require('../controllers/recipeInfo');

// Route for fetching random recipes
router.get('/recipe', recipeController.getRandomRecipes);
router.get('/recipeInfo', getHealthRecipes); 
// Route for fetching specific recipe details
router.get('/recipe/:id', recipeController.getRecipeDetails);
router.get('/recipeInfo/:recipeId', recipeInfoController.getRecipeDetails);



module.exports = router;
