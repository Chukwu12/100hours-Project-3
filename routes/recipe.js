// routes/recipe.js
const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const recipeController = require('../controllers/recipe');
const { ensureAuth } = require('../middleware/auth');
=======
const recipeController = require('../controllers/recipe').default;
>>>>>>> dd9f3286c5906758b70302c0ac375f5cc690bed8



 router.get('/', recipeController.getRandomRecipes); // Route to fetch random recipes
router.get('/view', recipeController.viewRecipes); // Route to render the recipe page

module.exports = router;
