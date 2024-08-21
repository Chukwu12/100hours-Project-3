// controllers/dessertController.js
const axios = require('axios');
const RECIPES_API_KEY = process.env.RECIPES_API_KEY || '15b2edef64f24d2c95b3cc72e3ad8f87';
const DESSERT_API_URL = 'https://api.spoonacular.com/recipes/random';


const getDessertRecipes = async (req, res) => {
    try {
        if (!RECIPES_API_KEY) {
            throw new Error('API key is missing');
        }

        const response = await axios.get(DESSERT_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 5,
                tags: 'dessert', // Filter to only include desserts
                includeNutrition: true,
            }
        });

          // If no recipes are found, handle it gracefully
          const recipes = response.data.recipes;
          if (!recipes || recipes.length === 0) {
              return res.status(404).json({ message: 'No dessert recipes found' });
          }
          
          const dessertRecipes = recipes.map(recipe => ({
              ...recipe,
              servings: recipe.servings,
              readyInMinutes: recipe.readyInMinutes,
              numberOfIngredients: recipe.extendedIngredients ? recipe.extendedIngredients.length : 0,
          }));
          

        return dessertRecipes;
    } catch (error) {
        console.error('Error fetching dessert recipes:', error.message);
        throw new Error('Error fetching dessert recipes');
    }
};

module.exports = {
    getDessertRecipes,
};
