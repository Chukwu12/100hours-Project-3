// controllers/dessertController.js
const axios = require('axios');
const RECIPES_API_KEY = process.env.RECIPES_API_KEY;
const DESSERT_API_URL = 'https://api.spoonacular.com/recipes/random';
const RECIPE_DETAILS_API_URL = 'https://api.spoonacular.com/recipes/{id}/information';

// require('dotenv').config({ path: './config/.env' });

const getDessertRecipes = async () => {
    try {
        if (!RECIPES_API_KEY) {
            throw new Error('API key is missing');
        }

        const response = await axios.get(DESSERT_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 5,
                tags: 'dessert', // Filter to only include desserts
               
            }
        });

        // If no recipes are found, return an empty array
        const recipes = response.data.recipes;
        if (!recipes || recipes.length === 0) {
            return []; // Return empty array if no recipes found
        }

        // Extract recipes and add the readyInMinutes field
        const dessertRecipes = recipes.map(recipe => ({
            ...recipe,
             spoonacularId: recipe.id.toString(),
            servings: recipe.servings,  // Get the number of servings
            readyInMinutes: recipe.readyInMinutes,  // Get the preparation time
            numberOfIngredients: recipe.extendedIngredients ? recipe.extendedIngredients.length : 0  // Number of ingredients
        }));

        return dessertRecipes;
    } catch (error) {
        console.error('Error fetching dessert recipes:', error.message);
        throw new Error('Error fetching dessert recipes');
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
