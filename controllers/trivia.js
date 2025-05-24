const axios = require('axios');
// Define the trivia API URL
const TRIVA_API_URL = 'https://api.spoonacular.com/food/trivia/random';
const RECIPES_API_KEY  = process.env.RECIPES_API_KEY ;

const randomTriva = async (req, res) => {
    try {
        // Fetch random trivia from the API
        const response = await axios.get(TRIVA_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY  
            }
        });

        // Send the trivia text as the response
        const triviaText = response.data.text;

        res.json({ trivia: triviaText });
    } catch (error) {
        console.error('Error fetching trivia:', error);
        res.status(500).send('Error fetching trivia');
    }
};

module.exports = {
    randomTriva
};