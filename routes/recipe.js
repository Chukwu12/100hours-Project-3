// routes/recipe.js
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe').default;

console.log('Recipe controller:', recipeController); // Debugging output to check if controller is imported correctly

router.get('/', (req, res) => {
    console.log('Route / accessed');
    recipeController.getRandomRecipes(req, res);
}); // Route to fetch random recipes

router.get('/view', (req, res) => {
    console.log('Route /view accessed');
    recipeController.viewRecipes(req, res);
}); // Route to render the recipe page

module.exports = router;
