// routes/health.js
const express = require('express');
const router = express.Router();
const healthyController = require('../controllers/healthy')


// Route to get random vegetarian recipes
 router.get('/health', healthyController.getHealthRecipes); // Route to fetch random  healthy recipes
 // Route to view the recipes
router.get('/view', healthyController.viewHealthRecipes); // Route to render the healthy recipe page

module.exports = router;
