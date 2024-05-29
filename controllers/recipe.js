// controllers/recipe.js


const RECIPES_API_KEY = process.env.RECIPES_API_KEY;
const RECIPES_API_URL = 'https://api.spoonacular.com/recipes/random';

module.exports = {
    getRandomRecipes: async (req, res) => {
        try {
            const response = await axios.get(RECIPES_API_URL, {
                params: {
                    apiKey: RECIPES_API_KEY,
                    number: 5  // Number of random recipes to fetch
                }
            });

            res.json(response.data); // Send the recipe data as the response
        } catch (error) {
            console.error('Error fetching data from Spoonacular:', error);
            res.status(500).send('Server Error');
        }
    },
    viewRecipes: (req, res) => {
        res.render('recipe'); // Render the recipe.ejs file
    }
};
