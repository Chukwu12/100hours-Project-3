// controllers/cuisine.js
const axios = require('axios');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY;

const getCuisineRecipes = async (req, res, cuisine) => {
    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
            params: {
                apiKey: RECIPES_API_KEY,
                cuisine: cuisine,
                number: 8
            }
        });

        res.render('cuisine', { recipes: response.data.results, cuisine });
    } catch (error) {
        console.error(`Error fetching ${cuisine} recipes:`, error.message);
        res.status(500).send('Server Error');
    }
};

const getAfricanRecipes = (req, res) => getCuisineRecipes(req, res, 'African');
const getAmericanRecipes = (req, res) => getCuisineRecipes(req, res, 'American');
const getAsianRecipes = (req, res) => getCuisineRecipes(req, res, 'Asian');
const getMexicanRecipes = (req, res) => getCuisineRecipes(req, res, 'Mexican');

module.exports = {
    getAfricanRecipes,
    getAmericanRecipes,
    getAsianRecipes,
    getMexicanRecipes
};
