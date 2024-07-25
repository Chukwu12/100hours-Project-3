const express = require('express');
const router = express.Router();
const { getCuisineRecipes } = require('../controllers/cuisine'); // Destructure both functions

// Route to get recipes by cuisine type
router.get('/:type', getCuisineRecipes);


module.exports = router;
