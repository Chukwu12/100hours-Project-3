// const axios = require('axios');
 const Wine = require('../models/Wine'); // Import the wine model
const WINE_DESCRIPTION_API = 'https://api.spoonacular.com/food/wine/description';
const WINE_PARING_API = 'https://api.spoonacular.com/food/wine/pairing';
const RECIPES_API_KEY = process.env.RECIPES_API_KEY;



exports.getRandomWine = async (req, res) => {
  try {
    // Define the wine categories based on your model
    const wineCategories = ['white_wine', 'red_wine', 'dessert_wine', 'rose_wine', 'sparkling_wine', 'sherry', 'vermouth', 'fruit_wine', 'mead'];
    
    // Randomly select a category
    const randomCategory = wineCategories[Math.floor(Math.random() * wineCategories.length)];
    
    // Find a wine with a random subcategory (example: 'dry_white_wine', 'sweet_white_wine')
    // First, we'll look for the wine subcategory in the 'types' map
    const randomSubcategory = Object.keys(Wine.schema.obj.types.obj).find(subcategory => subcategory.includes(randomCategory));  // This matches your categories like 'dry_white_wine'

    if (!randomSubcategory) {
      return res.status(500).json({ message: 'No subcategory found for this category.' });
    }

    // Get the wine types for that subcategory
    const wineTypes = randomSubcategory ? Wine.schema.obj.types.get(randomSubcategory) : [];

    // Randomly select a wine type from the list
    const randomWineType = wineTypes[Math.floor(Math.random() * wineTypes.length)];

    // Fetch wine pairing suggestion from Spoonacular API
    const pairingResponse = await axios.get(WINE_PARING_API, {
      params: {
        apiKey: RECIPES_API_KEY,
        wine: randomWineType, // Wine name to get a pairing
      }
    });

    const pairedRecipes = pairingResponse.data.pairings;

    // Fetch wine description from Spoonacular API
    const descriptionResponse = await axios.get(WINE_DESCRIPTION_API, {
      params: {
        apiKey: RECIPES_API_KEY,
        wine: randomWineType,  // Wine name to fetch a description
      }
    });

    // Combine wine data, pairing, and description
    const wineData = {
      name: randomWineType,
      category: randomCategory,
      description: descriptionResponse.data.text || 'No description available.',
      pairing: pairedRecipes.length > 0 ? pairedRecipes : 'No pairings available.',
    };

    // Render the page and pass the wine data
    console.log('Pairing Response:', pairingResponse.data);
    console.log('Description Response:', descriptionResponse.data);
    console.log('Wine Data:', wineData);  // Add this line to check if wineData has the expected structure
    res.render('recipe', {  
      wine: wineData,
    });

  } catch (error) {
    console.error('Error fetching random wine:', error.message);
    res.status(500).json({ message: 'Error fetching random wine' });
  }
};
