const express = require('express');
const router = express.Router();
const { getCuisineRecipes, viewCuisineRecipes } = require('../controllers/cuisine'); // Destructure both functions

// Route to get recipes by cuisine type
router.get('/:type', getCuisineRecipes);

// Route to view cuisine recipes
router.get('/view', viewCuisineRecipes); 

module.exports = router;
