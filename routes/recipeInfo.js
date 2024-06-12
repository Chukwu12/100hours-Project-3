// routes/recipeInfo.js
const express = require('express');
const router = express.Router();
const recipeInfoController = require('../controllers/recipeInfo');




router.get('/', recipeInfoController.getRandomFood); // Route to fetch random recipes
router.get('/view', recipeInfoController.viewRecipesInfo); // Route to render the recipe page

module.exports = router;
