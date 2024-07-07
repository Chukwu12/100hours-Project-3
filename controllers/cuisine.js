// controllers/cuisine.js
const axios = require('axios');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY;
const CUSINE_API_URL = 'https://api.spoonacular.com/recipes/complexSearch';

const getCuisineRecipes = async (req, res) => {
    const { type } = req.params; // Extract the type parameter from the request URL
    console.log(`Requested cuisine type: ${type}`);  // Log the requested type

    try {
        if (!RECIPES_API_KEY) {  // Check if the API key is available
            return res.status(401).json({ message: 'API key is missing' });
        }
         // Make a request to the external API to get recipes
        const response = await axios.get(CUSINE_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 8,
                cuisine: type,  // Use the type parameter to filter recipes by cuisine
                limitLicense: true,
            }
        });

        console.log(response.data.results);  // Log the results for debugging
        res.render('recipe', { cusineRecipes: response.data.results });
    } catch (error) {
        console.error('Error fetching data from Spoonacular:', error.message);
        res.status(500).send('Server Error');
    }
};

const viewCuisineRecipes = (req, res) => {
    res.render('recipe');
};

module.exports = {
    getCuisineRecipes,
    viewCuisineRecipes
};
