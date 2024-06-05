// controllers/recipe.js
import { get } from 'axios';

const RECIPES_API_KEY = process.env.RECIPES_API_KEY;
const RECIPES_API_URL = 'https://api.spoonacular.com/recipes/random';

console.log('API Key:', RECIPES_API_KEY); // Add this line to check if the API key is being read correctly

const viewRecipes = (req, res) => {
    console.log('viewRecipes called'); // Debugging output
    res.render('recipe.ejs');
};

const getRandomRecipes = async (req, res) => {
    console.log('getRandomRecipes called'); // Debugging output
    try {
        const res = await get(RECIPES_API_URL, {
            params: {
                number: 5, // Number of random recipes to fetch
                apiKey: RECIPES_API_KEY
            }
        });
        const recipes = res.data.recipes;
        res.render('recipes.ejs', { recipes }); // Render the recipes view with fetched recipes
    } catch (error) {
        console.error('Error fetching data from Spoonacular:', error.message);
        res.status(500).json({ message: error.message });
    }
};

export default {
    viewRecipes,
    getRandomRecipes
};