const express = require('express');
const router = express.Router();
const { getCuisineRecipes } = require('../controllers/cuisine'); // Destructure both functions
const cuisineController = require('../controllers/cuisine');
// Route to get recipes by cuisine type
router.get('/:type', getCuisineRecipes);
router.get('/details/:id', cuisineController.getRecipeDetails);

module.exports = router;
