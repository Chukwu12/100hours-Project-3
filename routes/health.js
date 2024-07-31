// routes/health.js
const express = require('express');
const router = express.Router();
const healthyController = require('../controllers/health')


// Route to get random vegetarian recipes
 router.get('/', healthyController.getHealthRecipes); // Route to fetch random  healthy recipes

 // Route to view the recipes

module.exports = router;
