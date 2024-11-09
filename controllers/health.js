// controllers/healthController.js
const axios = require('axios');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY;
const HEALTHY_API_URL = 'https://api.spoonacular.com/recipes/random';
require('dotenv').config({ path: './config/.env' });

const getHealthRecipes = async () => {
    try {
        if (!RECIPES_API_KEY) {
            throw new Error('API key is missing');
        }
             // Fetch healthy recipes from the API
        const response = await axios.get(HEALTHY_API_URL, {
            params: {
                apiKey: '479270df5629469ab4974af598b4474d',
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

const getHealthyDetails = async (req, res) => {
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
    getHealthRecipes,
    getHealthyDetails,
};
