// routes/health.js
const express = require('express');
const router = express.Router();
const { getHealthRecipes } = require('../controllers/health');
const healthController = require('../controllers/health');

// Route to get random vegetarian recipes
 router.get('/health', healthController.getHealthRecipes); // Route to fetch random  healthy recipes
 router.get('/health', getHealthRecipes); // Route to view the recipes

module.exports = router;
