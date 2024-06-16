// routes/health.js
const express = require('express');
const router = express.Router();
const healthyrecipeController = require('../controllers/healthy');



 router.get('/', healthyrecipeController.getHealthRecipes); // Route to fetch random recipes
router.get('/view', healthyrecipeController.viewHealthRecipes); // Route to render the recipe page

module.exports = router;
