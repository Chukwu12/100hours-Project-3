// controllers/healthController.js
const axios = require('axios');
const Recipe = require("../models/Recipe"); 


const RECIPES_API_KEY = process.env.RECIPES_API_KEY || '15b2edef64f24d2c95b3cc72e3ad8f87';
const HEALTHY_API_URL = 'https://api.spoonacular.com/recipes/complexSearch';

const getHealthRecipes = async (req, res) => {
    try {
        if (!RECIPES_API_KEY) {
            return res.status(401).json({ message: 'API key is missing' });
        }
             // Fetch healthy recipes from the API
        const response = await axios.get(HEALTHY_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 5,
                diet: 'vegetarian',
                sort: 'popularity',
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

        console.log('Fetched Health Recipes:', healthRecipes);


        // Check if healthRecipes is correctly defined
        if (!healthRecipes || healthRecipes.length === 0) {
            console.log('No healthRecipes found');
        } else {
            console.log('HealthRecipes count:', healthRecipes.length);
        }

        // Render the template with both healthData and dessertData
        res.render('recipeInfo', {healthRecipes});
        console.log(req.user); 

    } catch (error) {
        console.error('Error fetching data from Spoonacular:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};



module.exports = {
    getHealthRecipes,
};
