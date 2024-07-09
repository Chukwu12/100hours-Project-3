// controllers/cuisine.js
const axios = require('axios');
const Recipe = require('../models/Recipe');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY;
const CUSINE_API_URL = 'https://api.spoonacular.com/recipes/complexSearch';


// Function to get recipes by cuisine type
const getCuisineRecipes = async (req, res) => {
    const { type } = req.params; // 'african', 'american', 'asian', 'mexican', etc.
    res.send(`Recipes for cuisine type: ${type}`);
 
    try 
    {
        if (!RECIPES_API_KEY) {
            return res.status(401).json({ message: 'API key is missing' });
        }

        const response = await axios.get(CUSINE_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 8,
                cuisine: type,
                limitLicense: true,
            }
        });

        const apiRecipes = response.data.results;
        
        console.log(response.data.results);
             // Render the corresponding EJS template (e.g., 'african.ejs', 'american.ejs')
        res.render(`${type}`, { recipes: apiRecipes });
    } catch (error) {
        console.error('Error fetching data from Spoonacular:', error.message);
        res.status(500).send('Server Error');
    }
};





// Function to view all cuisine recipes
const viewCuisineRecipes = (req, res) => {
res.send('Viewing all cuisine recipes');
res.render('recipe');
};

module.exports = {
getCuisineRecipes,
viewCuisineRecipes
};







