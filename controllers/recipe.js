// controllers/recipe.js
const axios = require('axios');
const Favorite = require("../models/Favorite");
const Recipe = require("../models/Recipe"); // Assuming you have a Recipe model

require('dotenv').config({ path: './config/.env' });
const RECIPES_API_KEY = process.env.RECIPES_API_KEY;
const RECIPES_API_URL = 'https://api.spoonacular.com/recipes/random';
const RECIPE_DETAILS_API_URL = 'https://api.spoonacular.com/recipes/{id}/information';

console.log('API Key:', process.env.RECIPES_API_KEY);
const getRandomRecipes = async (req, res) => {
    try {
        // Check if the API key is available
        if (!RECIPES_API_KEY) {
            return res.status(401).json({ message: 'API key is missing' });
        }
        
        // Make the API request with the API key in the headers
        const response = await axios.get(RECIPES_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 5,  // Number of random recipes to fetch
                includeNutrition: true,
                limitLicense: true,
            }
        });
        //console.log('API Response:', response.data); // Log response for debugging
        
        // Extract recipes and add the readyInMinutes field
        const recipes = response.data.recipes.map(recipe => ({
            ...recipe,
            servings: recipe.servings,  // Get the number of servings
            readyInMinutes: recipe.readyInMinutes,  // Get the preparation time
            numberOfIngredients: recipe.extendedIngredients.length  // Number of ingredients
        }));
        
        return recipes;
      } catch (error) {
        console.error('Error fetching random recipes:', error.message);
        res.status(500).json({ message: 'Error fetching random recipes' });
    }
};


// Fetch detailed recipe information
const getRecipeDetails = async (req, res) => {
  try {
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
    getRandomRecipes,
    getRecipeDetails, 
};
