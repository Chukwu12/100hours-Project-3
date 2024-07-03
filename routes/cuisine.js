// routes/cuisine.js
const express = require('express');
const router = express.Router();
const cuisineController = require('../controllers/cuisine');

// Routes for each cuisine
router.get('/cusine/african', cuisineController.getAfricanRecipes);
router.get('/cusine/american', cuisineController.getAmericanRecipes);
router.get('/cusine/asian', cuisineController.getAsianRecipes);
router.get('/cusine/mexican', cuisineController.getMexicanRecipes);

module.exports = router;
