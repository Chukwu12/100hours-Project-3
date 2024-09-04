// controllers/cuisine.js
const axios = require('axios');
const RECIPE_DETAILS_API_URL = 'https://api.spoonacular.com/recipes/{id}/information';

const getCuisineRecipes = async (req, res) => {
    const type = req.params.type;
    const apiKey = process.env.RECIPES_API_KEY;

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
    getCuisineRecipes,
    getRecipeDetails
};
