// routes/health.js
const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health');

// Route to get random vegetarian recipes
router.get('/recipeInfo/:id', healthController.getHealthyDetails);

module.exports = router;
