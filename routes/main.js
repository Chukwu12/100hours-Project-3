const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');
const dessertController = require('../controllers/dessert');
const healthController = require('../controllers/health');

router.get('/recipe',async(req, res) => {
    try{
          // Fetch data from each controller
        const recipeData = await recipeController.getRandomRecipes();
        const dessertData = await dessertController.getDessertRecipes();
        const healthData = await healthController.getHealthRecipes ();

         // Combine the data
    const combinedData = {
        recipes: recipeData.recipes,
        desserts: dessertData.desserts,
        healthTips: healthData.healthTips
      };

      // Render the EJS template with the combined data
    res.render('recipe', combinedData);
} catch (error) {
  console.error('Error rendering page:', error);
  res.status(500).send('Internal Server Error');
}
});

module.exports = router;