// controllers/cuisine.js
const axios = require('axios');

const RECIPE_DETAILS_API_URL = 'https://api.spoonacular.com/recipes/{id}/information';

const getCuisineRecipes = async (req, res) => {
    const type = req.params.type;
    const apiKey = process.env.RECIPES_API_KEY || '15b2edef64f24d2c95b3cc72e3ad8f87';

    if (!apiKey) {
        return res.status(500).send('API Key is not defined');
    }

    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
            params: {
                cuisine: type,
                number: 6,
                instructionsRequired: true,
                sort: 'random',
                apiKey: apiKey
            }
        });
        const recipes = response.data.results;
        res.render('cuisine', { recipes, type });
    } catch (error) {
        res.status(500).send('Error fetching recipes');
    }
};

const getRecipeDetails = async (req, res) => {
    try {
        if (!apiKey) {
            return res.status(401).json({ message: 'API key is missing' });
        }

        const recipeId = req.params.id;
        const response = await axios.get(RECIPE_DETAILS_API_URL.replace('{id}', recipeId), {
            params: {
                apiKey: RECIPES_API_KEY,
            }
        });
        const recipeDetails = response.data;

        res.render('recipeInfo', { recipeDetails });
    } catch (error) {
        console.error('Error fetching recipe details from Spoonacular:', error.message);
        res.status(500).send('Server Error');
    }
};

const viewCuisineRecipes = (req, res) => {
    // Logic to view all cuisine recipes
    res.send('Viewing all cuisine recipes');
};

module.exports = {
    getCuisineRecipes,
    viewCuisineRecipes,
    getRecipeDetails
};
