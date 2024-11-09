const express = require('express');
const router = express.Router();
 const recipeController = require('../controllers/recipe');
const dessertController = require('../controllers/dessert');
const healthController = require('../controllers/health');
// const { ensureAuth } = require('../middleware/auth');  // Uncomment if using authentication

<<<<<<< HEAD
router.get('/recipe', async (req, res) => {
    try {
        // Fetch data from each controller
        const recipes = await recipeController.getRandomRecipes(); // This now returns data or throws an error
=======
router.get('/recipe', async(req, res) => {
    try{
          // Fetch data from each controller
         const recipes = await recipeController.getRandomRecipes();
>>>>>>> f4e82b1734431d02f1fae1ba1b9df3f0cdd4cc17
        const desserts = await dessertController.getDessertRecipes();
        const healthTips = await healthController.getHealthRecipes();

        // Combine the data
        const combinedData = {
            recipes: recipes || [],  // Ensure default if no recipes found
            desserts: desserts || [],
            healthTips: healthTips || [],
            user: req.user || null,  // Pass user data if needed
        };

<<<<<<< HEAD
        // Render the EJS template with the combined data
        res.render('recipe', combinedData);
    } catch (error) {
        console.error('Error rendering page:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
=======
      // Log fetched data for debugging
      console.log('Fetched recipes:', recipes);
      console.log('Fetched desserts:', desserts);
      console.log('Fetched health tips:', healthTips);

      // Render the EJS template with the combined data
    res.render('recipe', combinedData);
} catch (error) {
  console.error('Error rendering page:', error);
  res.status(500).send('Internal Server Error');
}
});



module.exports = router;
>>>>>>> f4e82b1734431d02f1fae1ba1b9df3f0cdd4cc17
