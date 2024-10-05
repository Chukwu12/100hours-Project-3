const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');
const dessertController = require('../controllers/dessert');
const healthController = require('../controllers/health');


// Route to fetch recipe details by ID
router.get('/recipe/:id', recipeController.getRecipeDetails);
router.get('/recipe/:id', dessertController.getRecipeDetails);
router.get('/recipe/:id', healthController.getHealthyDetails);

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
