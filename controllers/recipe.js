// controllers/recipe.js
const axios = require('axios'); // Add this line to import axios

const RECIPES_API_KEY = '15b2edef64f24d2c95b3cc72e3ad8f87';
const RECIPES_API_URL = 'https://api.spoonacular.com/recipes/random?number=5&include-tags=vegetarian,dessert';

module.exports = {
    getRandomRecipes: async (req, res) => {
        try {
              // Check if the API key is available
              if (!RECIPES_API_KEY) {
                return res.status(401).json({ message: 'API key is missing' });
            }
                // Make the API request with the API key in the headers
                const response = await axios.get(RECIPES_API_URL, {
                params: {
                    apiKey: RECIPES_API_KEY,
                    number: 1,  // Number of random recipes to fetch
                    includeNutrition: true,
                    limitLicense: true,
                }
            });
  // Pass the recipe data to the template
  res.render('recipe', { recipeData: response.data.recipes });
} catch (error) {
    // Handle errors
    console.error('Error fetching data from Spoonacular:', error);
    // Handle the error response
    res.status(500).send('Server Error');
}
},

    viewRecipes: (req, res) => {
        res.render('recipe.ejs'); // Render the recipe.ejs file
    }
};
