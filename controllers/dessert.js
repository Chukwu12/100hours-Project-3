// controllers/recipe.js
const axios = require('axios');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY || '15b2edef64f24d2c95b3cc72e3ad8f87';
const DESSERT_RECIPES_API_URL = 'https://api.spoonacular.com/recipes/complexSearch';
// const RECIPE_DETAILS_API_URL = 'https://api.spoonacular.com/recipes/{id}/information';


const getDessertRecipes = async (req, res) => {
    try {
        // Check if the API key is available
        if (!RECIPES_API_KEY) {
            return res.status(401).json({ message: 'API key is missing' });
        }
        
        // Make the API request with the API key in the headers
        const response = await axios.get(DESSERT_RECIPES_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                type: 'dessert', // Filter for dessert recipes
                number: 5,  // Number of random recipes to fetch
                includeNutrition: true,
                limitLicense: true,
            }
        });
        
        // Extract recipes and add the readyInMinutes field
        const dessertrecipes = response.data.recipes.map(recipe => ({
            ...recipe,
            servings: recipe.servings,  // Get the number of servings
            readyInMinutes: recipe.readyInMinutes,  // Get the preparation time
            numberOfIngredients: recipe.extendedIngredients.length  // Number of ingredients
        }));
        
        // Pass the recipe data to the template
        res.render('recipe', { dessertData:  dessertrecipes });
    } catch (error) {
        // Handle errors
        console.error('Error fetching data from Spoonacular:', error.message);
        res.status(500).send('Server Error');
    }
};

// const getRecipeDetails = async (req, res) => {
//     try {
//         if (!RECIPES_API_KEY) {
//             return res.status(401).json({ message: 'API key is missing' });
//         }

//         const recipeId = req.params.id;
//         const response = await axios.get(RECIPE_DETAILS_API_URL.replace('{id}', recipeId), {
//             params: {
//                 apiKey: RECIPES_API_KEY,
//             }
//         });

//         const recipeDetails = response.data;

//         res.render('recipeInfo', { recipeDetails });
//     } catch (error) {
//         console.error('Error fetching recipe details from Spoonacular:', error.message);
//         res.status(500).send('Server Error');
//     }
// };



const viewDessertRecipes = (req, res) => {
    res.render('recipe'); // Render the recipe.ejs file
};

module.exports = {
    getDessertRecipes,
    viewDessertRecipes
    
};
