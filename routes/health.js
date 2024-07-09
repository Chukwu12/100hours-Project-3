// routes/health.js
const express = require('express');
const router = express.Router();
const { getHealthRecipes, viewHealthRecipes } = require('../controllers/healthy');


// Route to get random vegetarian recipes
 router.get('/', getHealthRecipes); // Route to fetch random recipes
 // Route to view the recipes
router.get('/view',
    viewHealthRecipes); // Route to render the recipe page

module.exports = router;
