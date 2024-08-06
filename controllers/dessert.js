// controllers/dessertController.js
const axios = require('axios');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY || '15b2edef64f24d2c95b3cc72e3ad8f87';
const DESSERT_API_URL = 'https://api.spoonacular.com/recipes/complexSearch';

const getDessertRecipes = async (req, res) => {
    try {
        if (!RECIPES_API_KEY) {
            return res.status(401).json({ message: 'API key is missing' });
        }

        const response = await axios.get(DESSERT_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 5,
                type: 'dessert',
                includeNutrition: true,
                limitLicense: true,
            }
        });

        const dessertRecipes = response.data.results.map(recipe => ({
            ...recipe,
            servings: recipe.servings,
            readyInMinutes: recipe.readyInMinutes,
            numberOfIngredients:recipe.extendedIngredients ? recipe.extendedIngredients.length : 0,
        }));

        console.log('Fetched Dessert Recipes:', dessertRecipes);

        // Render the template with both dessertData and healthData
        res.render('recipeInfo', {dessertRecipes});

    } catch (error) {
        console.error('Error fetching data from Spoonacular:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getDessertRecipes
};
