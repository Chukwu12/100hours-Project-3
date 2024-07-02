// controllers/cuisine.js
const axios = require('axios');

const RECIPES_API_KEY = process.env.RECIPES_API_KEY;
const CUSINE_API_KEY = 'https://api.spoonacular.com/recipes/complexSearch';

const getCuisineRecipes = async (req, res) => {
    const { type } = req.params;

    try {
        if (!RECIPES_API_KEY) {
            return res.status(401).json({ message: 'API key is missing' });
        }

        const response = await axios.get(CUSINE_API_KEY, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 8,
                cuisine: type,
                limitLicense: true,
            }
        });

        console.log(response.data.results);
        res.render('recipe', { recipes: response.data.results });
    } catch (error) {
        console.error('Error fetching data from Spoonacular:', error.message);
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
