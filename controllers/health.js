// controllers/healthController.js
const axios = require('axios');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY || '15b2edef64f24d2c95b3cc72e3ad8f87';
const HEALTHY_API_URL = 'https://api.spoonacular.com/recipes/complexSearch';

const getHealthRecipes = async (req, res) => {
    try {
        if (!RECIPES_API_KEY) {
            throw new Error('API key is missing');
        }
             // Fetch healthy recipes from the API
        const response = await axios.get(HEALTHY_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 8,
                diet: 'vegetarian',
                includeNutrition: true,
                limitLicense: true,
            }
        });

        const healthRecipes = response.data.results.map(recipe => ({
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
