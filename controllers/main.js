// controllers/mainController.js
 const recipeController = require('../controllers/recipe');
const dessertController = require('../controllers/dessert');
const healthController = require('../controllers/health');

exports.combinedData =  (req, res) => {
    try {
        // Fetch data from each controller
         const recipes =  recipeController.getRandomRecipes();
        const desserts =  dessertController.getDessertRecipes();
        const healthTips =  healthController.getHealthRecipes();

        // Combine the data
        const combinedData = {
             recipes,
            desserts,
            healthTips,
            user: req.user // Pass user data if needed
            
        };
        console.log('Fetched recipes:', recipes);
console.log('Fetched desserts:', desserts);
console.log('Fetched health tips:', healthTips);


        // Render the EJS template with the combined data
          res.render('recipe', combinedData);
    } catch (error) {
        console.error('Error rendering page:', error);
        res.status(500).send('Internal Server Error');
    }
};
