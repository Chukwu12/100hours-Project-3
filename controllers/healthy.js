// controllers/healthy.js
const axios = require('axios');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY;

const getHealthRecipes = async (req, res) => {
    try {
        // Check if the API key is available
        if (!RECIPES_API_KEY) {
            return res.status(401).json({ message: 'API key is missing' });
        }
        
        // Make the API request with the API key in the headers
        const healthResponse = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 8,  // Number of random recipes to fetch
                diet: 'vegetarian',  // Specify that we want vegetarian recipes
                limitLicense: true,
            }
        });

         // Log the response data
         console.log(healthResponse.data.results);


         
        // Pass the recipe data to the template
        res.render('recipe', { healthRecipes: healthResponse.data.recipes });
    } catch (error) {
        // Handle errors
        console.error('Error fetching data from Spoonacular:', error.message);
        res.status(500).send('Server Error');
    }
};

const viewHealthRecipes = (req, res) => {
    res.render('recipe', { healthRecipes: [] }); // Render the recipe.ejs file
};




module.exports = {
    getHealthRecipes,
    viewHealthRecipes
};
        