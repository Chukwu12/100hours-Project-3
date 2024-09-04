// controllers/recipeInfo.js
const axios = require('axios');
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY;
const RECIPE_DETAILS_API_URL = 'https://api.spoonacular.com/recipes/{id}/information';


const getRecipeDetails = async (req, res) => {
    try {
        if (!RECIPES_API_KEY) {
            return res.status(401).json({ message: 'API key is missing' });
        }
         // Extract recipe ID from request parameters
        const recipeId = req.params.id;
        const response = await axios.get(RECIPE_DETAILS_API_URL.replace('{id}', recipeId), {
            params: {
                apiKey: RECIPES_API_KEY,
            }
        });
        // Get the recipe details from the response
        const recipeDetails = response.data;
         // Render the recipe details using the EJS template
        res.render('recipeInfo', { recipe: recipeDetails }); // Render the EJS template with recipe details
    } catch (error) {
         // Handle errors and provide detailed information
        if (error.response && error.response.status === 404) {
            console.error('Recipe not found:', error.response.data);
            res.status(404).json({ message: 'Recipe not found' });
        } else {
            console.error('Error fetching recipe details from Spoonacular:', error.message);
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
};




module.exports = {
    getRecipeDetails,
    
};





