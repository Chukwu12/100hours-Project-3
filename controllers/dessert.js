// controllers/dessertController.js
const axios = require('axios');
const { RANDOM_API_URL } = require('../config/api');
const RECIPES_API_KEY = process.env.RECIPES_API_KEY;
const formatRecipeData = require('../utils/formatRecipeData.js');
const RECIPE_DETAILS_API_URL = 'https://api.spoonacular.com/recipes/{id}/information';

// require('dotenv').config({ path: './config/.env' });

const getDessertRecipes = async () => {
    try {
        if (!RECIPES_API_KEY) {
            throw new Error('API key is missing');
        }

        const response = await axios.get(RANDOM_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 5,
                tags: 'dessert', // Filter to only include desserts       
            }
        });

        const recipes = response.data.recipes || [];

        return recipes.map(formatRecipeData);
      } catch (error) {
        console.error('Error fetching dessert recipes:', error.message);
        return []; // Return empty array on error
      }
    };
    


   
   

// Fetch detailed recipe information
const getRecipeDetails = async (req, res) => {
    try {
           // Check for API key
           if (!RECIPES_API_KEY) {
            return res.status(401).json({ message: 'API key is missing' });
        }
        const recipeId = req.params.id;
  
        if (!recipeId) {
          return res.status(400).send('Recipe ID is required');
        }
  
        // Fetch recipe details from the API
        const response = await axios.get(RECIPE_DETAILS_API_URL.replace('{id}', recipeId), {
            params: {
                apiKey: RECIPES_API_KEY,
            }
        });
  
        const recipe = response.data;
  
        // Validate that the recipe data contains the expected fields
      if (!recipe.title || !recipe.image || !recipe.servings || !recipe.readyInMinutes || !recipe.instructions || !Array.isArray(recipe.extendedIngredients)) {
        return res.status(500).send('Recipe data is incomplete');
      }
  
  
        // Render the recipe details page
        res.render('recipeInfo', {
            recipe: {
                title: recipe.title,
                image: recipe.image,
                servings: recipe.servings,
                readyInMinutes: recipe.readyInMinutes,
                instructions: recipe.instructions,
                ingredients: recipe.extendedIngredients
            }
        });
    } catch (error) {
        console.error('Error fetching recipe details:', error.message);
        res.status(500).send('Error fetching recipe details');
    }
  };

module.exports = {
    getDessertRecipes,
    getRecipeDetails,
};
