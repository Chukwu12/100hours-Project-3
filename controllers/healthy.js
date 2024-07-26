// controllers/healthy.js
const axios = require('axios');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY || '15b2edef64f24d2c95b3cc72e3ad8f87';
const HEALTHY_API_URL = 'https://api.spoonacular.com/recipes/complexSearch';

const getHealthRecipes = async (req, res) => {
    try {

        // Check if the API key is available
        if (!RECIPES_API_KEY) {
            return res.status(401).json({ message: 'API key is missing' });
        }
        
        // Make the API request with the API key in the headers
        const response = await axios.get(HEALTHY_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 5, // Number of recipes to fetch
                diet: 'vegetarian', // Filter recipes for vegetarians
                sort: 'popularity', // Sort by popularity
                includeNutrition: true,
                limitLicense: true,
                   
            }
        });

          // Extract recipes from the response
          const healthRecipes = response.data.recipes.map(recipe => ({
            ...recipe,
            servings: recipe.servings,  // Get the number of servings
            readyInMinutes: recipe.readyInMinutes,  // Get the preparation time
            numberOfIngredients: recipe.extendedIngredients.length  // Number of ingredients
        }));

         // Log the response data
         console.log('Fetched Health Recipes:', healthRecipes); // Log for debugging

        // Pass the recipe data to the template
        res.render('recipe', { recipeData: healthRecipes });
    
    } catch (error) {
        console.error('Error fetching data from Spoonacular:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message }); // Provide a bit more context in the error response
    }
};

const viewHealthRecipes = (req, res) => {
    res.render('recipe'); // Render the recipe.ejs file
};


module.exports = {
    getHealthRecipes,
    viewHealthRecipes
};
        