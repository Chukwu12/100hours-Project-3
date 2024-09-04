// controllers/healthController.js
const axios = require('axios');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY;
const HEALTHY_API_URL = 'https://api.spoonacular.com/recipes/random';

const getHealthRecipes = async (req, res) => {
    try {
        if (!RECIPES_API_KEY) {
            throw new Error('API key is missing');
        }
             // Fetch healthy recipes from the API
        const response = await axios.get(HEALTHY_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 5,
                tags: 'vegetarian', // Filter to only include healthy options
                includeNutrition: true,
            }
        });

        const healthRecipes = response.data.recipes.map(recipe => ({
            ...recipe,
            servings: recipe.servings,
            readyInMinutes: recipe.readyInMinutes,
            numberOfIngredients:recipe.extendedIngredients ? recipe.extendedIngredients.length : 0,
        }));

        return healthRecipes;
    } catch (error) {
        console.error('Error fetching health recipes:', error.message);
        throw new Error('Error fetching health recipes');
    }
};


module.exports = {
    getHealthRecipes,
};
