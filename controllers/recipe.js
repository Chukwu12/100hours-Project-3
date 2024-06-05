// controllers/recipe.js
const axios = require('axios');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY || 'your-default-api-key';
const RECIPES_API_URL = 'https://api.spoonacular.com/recipes/random';

const getRandomRecipes = async (req, res) => {
    try {
        // Check if the API key is available
        if (!RECIPES_API_KEY) {
            return res.status(401).json({ message: 'API key is missing' });
        }
        
        // Make the API request with the API key in the headers
        const response = await axios.get(RECIPES_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 5,  // Number of random recipes to fetch
                includeNutrition: true,
                limitLicense: true,
            }
        });
        
        // Pass the recipe data to the template
        res.render('recipe', { recipeData: response.data.recipes });
    } catch (error) {
        // Handle errors
        console.error('Error fetching data from Spoonacular:', error.message);
        res.status(500).send('Server Error');
    }
};

const viewRecipes = (req, res) => {
    res.render('recipe'); // Render the recipe.ejs file
};

module.exports = {
    getRandomRecipes,
    viewRecipes
};
