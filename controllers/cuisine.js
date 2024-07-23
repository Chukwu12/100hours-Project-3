// controllers/cuisine.js
const axios = require('axios');

const getCuisineRecipes = async (req, res) => {
    const type = req.params.type;
    const apiKey = process.env.RECIPES_API_KEY;

    if (!apiKey) {
        return res.status(500).send('API Key is not defined');
    }

    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
            params: {
                cuisine: type,
                number: 5,
                instructionsRequired: true,
                sort: 'random',
                apiKey: apiKey
            }
        });
        const recipes = response.data.results;
        res.render('cuisine', { recipes, type });
    } catch (error) {
        res.status(500).send('Error fetching recipes');
    }
};

const viewCuisineRecipes = (req, res) => {
    // Logic to view all cuisine recipes
    res.send('Viewing all cuisine recipes');
};

module.exports = {
    getCuisineRecipes,
    viewCuisineRecipes
};
