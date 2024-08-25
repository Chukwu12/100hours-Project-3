// routes/recipe.js
const express = require('express');
const router = express.Router();
const dessertController = require('../controllers/dessert');

// Route to fetch dessert recipe details by ID
router.get('/recipeInfo/:id', dessertController.getRecipeDetails);

module.exports = router;
