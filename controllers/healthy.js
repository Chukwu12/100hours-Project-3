// controllers/healthy.js
const axios = require('axios');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY ||'15b2edef64f24d2c95b3cc72e3ad8f87';
const RECIPES_API_URL = 'https://api.spoonacular.com/recipes/random';


const getHealthRecipes = async (req, res) => {
    try {
        // Check if the API key is available
        if (!RECIPES_API_KEY) {
            return res.status(401).json({ message: 'API key is missing' });
        }
        
        // Make the API request with the API key in the headers
        const response = await axios.get(RECIPES_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 8,  // Number of random recipes to fetch
                tags: vegetarian,  // Specify that we want vegetarian recipes
                limitLicense: true,
            }
        });

         
        // Pass the recipe data to the template
        res.render('recipe', { healthRecipes: response.data.recipes });
    } catch (error) {
        // Handle errors
        console.error('Error fetching data from Spoonacular:', error.message);
        res.status(500).send('Server Error');
    }
};

const viewHealthRecipes = (req, res) => {
    res.render('recipe'); // Render the recipe.ejs file
};

module.exports = {
    getHealthRecipes,
    viewHealthRecipes
};
        