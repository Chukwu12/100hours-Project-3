const express = require('express');
const router = express.Router();
const axios = require('axios');


const recipeController = require('../controllers/recipe');
const recipeInfoController = require('../controllers/recipeInfo');

// Route for fetching random recipes
router.get('/recipe', recipeController.getRandomRecipes);

// Route for fetching specific recipe details
router.get('/recipe/:id', recipeController.getRecipeDetails);

router.get('/:id', recipeInfoController.getRecipeDetails);

const RECIPES_API_KEY = process.env.RECIPES_API_KEY || 'your_default_api_key';
const RECIPE_DETAILS_API_URL = 'https://api.spoonacular.com/recipes';

router.get('/:id', async (req, res) => {
    const recipeId = req.params.id;
    
    try {
        const response = await axios.get(`${RECIPE_DETAILS_API_URL}/${recipeId}/information`, {
            params: {
                apiKey: RECIPES_API_KEY
            }
        });

        const recipeDetails = response.data;

        res.render('recipeInfo', { recipeDetails });
    } catch (error) {
        console.error('Error fetching recipe details:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


module.exports = router;
