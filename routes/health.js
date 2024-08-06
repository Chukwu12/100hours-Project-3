// routes/health.js
const express = require('express');
const router = express.Router();
const { getHealthRecipes } = require('../controllers/health');

// Route to get random vegetarian recipes
//  router.get('/health', healthyController.getHealthRecipes); // Route to fetch random  healthy recipes
router.get('/health', getHealthRecipes); 
 // Route to view the recipes

module.exports = router;
