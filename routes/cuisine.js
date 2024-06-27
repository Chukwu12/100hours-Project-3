// routes/cuisine.js
const express = require('express');
const router = express.Router();
const cuisineController = require('../controllers/cuisine');

// Routes for each cuisine
router.get('/african', cuisineController.getAfricanRecipes);
router.get('/american', cuisineController.getAmericanRecipes);
router.get('/asian', cuisineController.getAsianRecipes);
router.get('/mexican', cuisineController.getMexicanRecipes);

module.exports = router;
