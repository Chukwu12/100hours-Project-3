// controllers/cuisine.js
const axios = require('axios');
// const Recipe = require('../models/Recipe');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY;
const CUSINE_API_URL = 'https://api.spoonacular.com/recipes/complexSearch';


// Function to get recipes by cuisine type
const getCuisineRecipes = async (req, res) => {
    const { type } = req.params; // 'african', 'american', 'asian', 'mexican', etc.
    
 
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
        console.log(response.data.results);


             // Render the corresponding EJS template (e.g., 'african.ejs', 'american.ejs')
             res.render('cusine', { recipes: response.data.results, cuisineType: type });
    } catch (error) {
        console.error('Error fetching data from Spoonacular:', error.message);
        res.status(500).send('Server Error');
    }
};





// Function to view all cuisine recipes


module.exports = { getCuisineRecipes };






