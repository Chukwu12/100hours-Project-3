// routes/recipe.js
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');

// Route to fetch recipe details by ID
router.get('/recipeInfo/:id', recipeController.getRecipeDetails);


module.exports = router;
