// controllers/recipeInfo.js
const axios = require('axios');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY;
const RECIPE_DETAILS_API_URL = 'https://api.spoonacular.com/recipes';


const getRecipeDetails = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const response = await axios.get(`${RECIPE_DETAILS_API_URL}/${recipeId}/information`, {
            params: {
                apiKey: RECIPES_API_KEY
            }
        });

        const recipeDetails = response.data;
        res.json(recipeDetails); // Send JSON response with recipe details
    } catch (error) {
        console.error('Error fetching recipe details from Spoonacular:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getRecipeDetails
};