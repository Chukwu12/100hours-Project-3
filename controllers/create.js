 const API_FOOD_TRIVA = 'https://api.spoonacular.com/food/trivia/random';
  const RECIPES_API_KEY = process.env.RECIPES_API_KEY;

const foodFacts = async (req, res) => {
    try {
        if (!RECIPES_API_KEY) {
            throw new Error('API key is missing');
        }

        const response = await axios.get(API_FOOD_TRIVA, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': RECIPES_API_KEY // Send the API key in the headers
            }
        });

        // Check for a valid response
        if (!response || !response.data) {
            return res.status(500).json({ message: 'Invalid API response' });
        }

        const trivia = response.data.text;
        // Render or return the trivia as needed
        res.render('profile', { trivia });
        
    } catch (error) {
        console.error('Error fetching food trivia:', error);
        res.status(500).json({ message: 'An error occurred while fetching food trivia.' });
    }
};


module.exports = {
     foodFacts,
  }