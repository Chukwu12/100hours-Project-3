// const axios = require('axios');
 const Wine = require('../models/Wine'); // Import the wine model
const WINE_DESCRIPTION_API = 'https://api.spoonacular.com/food/wine/description';
const WINE_PARING_API = 'https://api.spoonacular.com/food/wine/pairing';
const RECIPES_API_KEY = process.env.RECIPES_API_KEY;



exports.getChardonnayWine = async (req, res) => {
  try {
    // Hardcoded Chardonnay wine
    const wineName = 'chardonnay';
    const wineCategory = 'white_wine'; // Chardonnay is a white wine

    // Fetch wine description from Spoonacular API
    const descriptionResponse = await axios.get(WINE_DESCRIPTION_API, {
      params: {
        apiKey: RECIPES_API_KEY,
        wine: wineName,  // Chardonnay wine
      }
    });

    // Fetch food pairing for Chardonnay from Spoonacular API
    const pairingResponse = await axios.get(WINE_PARING_API, {
      params: {
        apiKey: RECIPES_API_KEY,
        wine: wineName,  // Chardonnay wine
      }
    });

    const pairedRecipes = pairingResponse.data.pairings || []; // Get pairings, default to empty array

    // Prepare wine data
    const wineData = {
      name: wineName,
      category: wineCategory,
      description: descriptionResponse.data.text || 'No description available.',
      pairing: pairedRecipes.length > 0 ? pairedRecipes : 'No pairings available.',
    };

    // Render the page and pass the wine data to EJS
    res.render('recipe', {
      wine: wineData,
    });

  } catch (error) {
    console.error('Error fetching Chardonnay wine details:', error.message);
    res.status(500).json({ message: 'Error fetching Chardonnay wine details.' });
  }
};