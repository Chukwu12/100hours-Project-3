// controllers/healthy.js
const axios = require('axios');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY;
const HEAlTHY_API_URL = 'https://api.spoonacular.com/recipes/complexSearch';

const getHealthRecipes = async (req, res) => {
    try {
        // Check if the API key is available
        if (!RECIPES_API_KEY) {
            return res.status(401).json({ message: 'API key is missing' });
        }
        
        // Make the API request with the API key in the headers
        const response = await axios.get(HEAlTHY_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 8,
                diet: 'vegetarian',
                limitLicense: true,
            }
        });

         // Log the response data
         console.log(response.data.results);  // Log for debugging

        // Pass the recipe data to the template
        res.render('recipe', { healthRecipes: response.data.results });  // Add an empty array for recipeData if necessary
    } catch (error) {
        console.error('Error fetching data from Spoonacular:', error.message);
        res.status(500).send('Server Error');
    }
};

const viewHealthRecipes = (req, res) => {
    res.render('recipe'); // Render the recipe.ejs file
};


module.exports = {
    getHealthRecipes,
    viewHealthRecipes
};
        