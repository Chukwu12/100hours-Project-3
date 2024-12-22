// const axios = require('axios');
 const Wine = require('../models/Wine'); // Import the wine model
const WINE_DESCRIPTION_API = 'https://api.spoonacular.com/food/wine/description';
const WINE_PARING_API = 'https://api.spoonacular.com/food/wine/pairing';
const RECIPES_API_KEY = process.env.RECIPES_API_KEY;



exports.getRandomWine = async (req, res) => {
  try {
    // Define the wine categories based on your model
    const wineCategories = ['white_wine', 'red_wine', 'dessert_wine', 'rose_wine', 'sparkling_wine', 'sherry', 'vermouth', 'fruit_wine'];

    // Randomly select a category
    const randomCategory = wineCategories[Math.floor(Math.random() * wineCategories.length)];

    // Get all the subcategories of the selected category
    const wineCategoryData = await Wine.findOne({}, `${randomCategory}`).exec();

    if (!wineCategoryData || !wineCategoryData[randomCategory]) {
      return res.status(500).json({ message: 'No wines found in the selected category.' });
    }

    // Randomly select a subcategory within the category (e.g., dry_white_wine, mueller_thurgau)
    const subcategoryKeys = Object.keys(wineCategoryData[randomCategory]);
    const randomSubcategory = subcategoryKeys[Math.floor(Math.random() * subcategoryKeys.length)];

    // Get the wine types for that subcategory
    const wineTypes = wineCategoryData[randomCategory][randomSubcategory];
    
    if (!wineTypes || wineTypes.length === 0) {
      return res.status(500).json({ message: 'No wines found in the selected subcategory.' });
    }

    // Randomly select a wine from the wine types
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

    // Log responses for debugging (optional)
    console.log('Pairing Response:', pairingResponse.data);
    console.log('Description Response:', descriptionResponse.data);
    console.log('Wine Data:', wineData);  // Log the combined wine data for debugging

    // Render the page and pass the wine data
    res.render('recipe', {  
      wine: wineData,
    });

  } catch (error) {
    console.error('Error fetching random wine:', error.message);
    res.status(500).json({ message: 'Error fetching random wine' });
  }
};