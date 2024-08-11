const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');



router.get('/recipe/:id', async (req, res) => {
    try {
        const recipeDetails = await recipeController.getRecipeDetails(req.params.id);
        res.render('recipeDetails', { recipe: recipeDetails });
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
