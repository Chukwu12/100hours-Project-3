// controllers/mainController.js
const recipeController = require('../controllers/recipe');
const dessertController = require('../controllers/dessert');
const healthController = require('../controllers/health');
const { getRandomWineData } = require('../controllers/wine');

exports.combinedData = async (req, res) => {
    try {
        // Fetch data from each controller
        const [recipes, desserts, healthTips, wine] = await Promise.all([
            recipeController.getRandomRecipes(),
            dessertController.getDessertRecipes(),
            healthController.getHealthRecipes(),
            getRandomWineData()
        ]);

        // Combine the data
        const combinedData = {
            recipes,
            desserts,
            healthTips,
            wine,
            user: req.user // Pass user data if needed        
        };
        console.log('🍷 Final Wine Data to EJS:', wine); // Debug log
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
