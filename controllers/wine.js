// const axios = require('axios');
 const Wine = require('../models/Wine'); // Import the wine model
// const WINE_DESCRIPTION_API = 'https://api.spoonacular.com/food/wine/description';
// const WINE_PARING_API = 'https://api.spoonacular.com/food/wine/pairing';
// const RECIPES_API_KEY = process.env.RECIPES_API_KEY;

// Function to get a random wine from the database
// exports.getRandomWine = async (req, res) => {
//     try {
//         // Fetch a random wine from your database
//         const wineCount = await Wine.countDocuments();
//         const randomIndex = Math.floor(Math.random() * wineCount);
//         const randomWine = await Wine.findOne().skip(randomIndex); // Skips to a random wine in the collection

//         if (!randomWine) {
//             return res.status(404).json({ message: 'No wines found' });
//         }

//         // Fetch wine pairing suggestion from Spoonacular API
//         const pairingResponse = await axios.get(WINE_PARING_API, {
//             params: {
//                 apiKey: RECIPES_API_KEY, // Spoonacular API Key
//                 wine: randomWine.name,  // Wine name to get a pairing
//             }
//         });

//         // Combine the wine data and pairing suggestion
//         const pairedRecipes = pairingResponse.data.pairings;

//         // Fetch wine description from Spoonacular API
//         const descriptionResponse = await axios.get(WINE_DESCRIPTION_API, {
//             params: {
//                 apiKey: RECIPES_API_KEY, // Spoonacular API Key
//                 wine: randomWine.name,  // Wine name to fetch a description
//             }
//         });

//         // Combine wine data, pairing and description
//         const wineData = {
//             name: randomWine.name,
//             category: randomWine.category,
//             description: descriptionResponse.data.text || 'No description available.',
//             pairing: pairedRecipes.length > 0 ? pairedRecipes : 'No pairings available.',
//         };

//         // Render the page and pass the wine data
//         res.render('recipe', {
//             wine: wineData,
//             // Include other data like recipes, desserts, health tips as needed
//             user: req.user, // Example user data if needed
//         });

//     } catch (error) {
//         console.error('Error fetching random wine:', error.message);
//         res.status(500).json({ message: 'Error fetching random wine' });
//     }
// };

// Function to get wine details (like description, category, etc.)
// exports.getWineDetails = async (req, res) => {
//     try {
//         const wineId = req.params.id;
//         const wine = await Wine.findById(wineId);

//         if (!wine) {
//             return res.status(404).json({ message: 'Wine not found' });
//         }

//         // Fetch wine description from Spoonacular API
//         const descriptionResponse = await axios.get(WINE_DESCRIPTION_API, {
//             params: {
//                 apiKey: RECIPES_API_KEY,  // Spoonacular API Key
//                 wine: wine.name,  // Wine name to fetch a description
//             }
//         });

//         res.json({
//             wine,
//             description: descriptionResponse.data.text,  // Wine description
//         });
//     } catch (error) {
//         console.error('Error fetching wine details:', error.message);
//         res.status(500).json({ message: 'Error fetching wine details' });
//     }
// };
// wineController.js

const Wine = require('../models/Wine'); // Assuming the Wine model is correctly imported

// Function to get a random wine
exports.getRandomWine = async (req, res) => {
  try {
    const count = await Wine.countDocuments();  // Get the total number of wines in the database
    const randomIndex = Math.floor(Math.random() * count);  // Generate a random index within the range of document count

    const randomWine = await Wine.findOne().skip(randomIndex);  // Skip to the random index and fetch the wine

    if (!randomWine) {
      return res.status(404).json({ message: 'No wine found' });
    }

    res.json(randomWine);  // Return the random wine as JSON
  } catch (err) {
    console.error('Error fetching random wine:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
