const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');
const dessertController = require('../controllers/dessert');
const healthController = require('../controllers/health');
// const { ensureAuth } = require('../middleware/auth');  // Uncomment if using authentication

router.get('/recipe', async (req, res) => {
    try {
        // Fetch data from each controller
        const recipes = await recipeController.getRandomRecipes(); // This now returns data or throws an error
        const desserts = await dessertController.getDessertRecipes();
        const healthTips = await healthController.getHealthRecipes();

        // Combine the data
        const combinedData = {
            recipes: recipes || [],  // Ensure default if no recipes found
            desserts: desserts || [],
            healthTips: healthTips || [],
            user: req.user || null,  // Pass user data if needed
        };

        // Render the EJS template with the combined data
        res.render('recipe', combinedData);
    } catch (error) {
        console.error('Error rendering page:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
