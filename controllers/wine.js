// const axios = require('axios');
const Wine = require('../models/Wine'); // Import the wine model
// const WINE_DESCRIPTION_API  = 'https://api.spoonacular.com/food/wine/description';
// const WINE_PARING_API = 'https://api.spoonacular.com/food/wine/pairing';
// const RECIPES_API_KEY = '479270df5629469ab4974af598b4474d'

// Function to fetch the wine description from Spoonacular API
// Controller to get one wine (not random)

// Controller to get one wine (not random)
// const getWinePairingAndDescription = async (req, res) => {
//   let winePairing = {};  // Object to store the wine data

//   try {
//       // Fetch the first wine from the database (instead of random)
//       const wineData = await Wine.findOne();  // This will get the first wine in the collection

//       if (!wineData) {
//           // If no wine is found in the database
//           winePairing = {
//               wineName: 'No wine found',
//               wineCategory: 'No category available',
//               wineSubcategory: 'No subcategory available',
//               wineFlavors: 'No flavors available',
//               wineRegion: 'No region available',
//               wineVintage: 'No vintage available',
//           };
//       } else {
//           // Get the wine data
//           winePairing = {
//               wineName: wineData.name || 'Unknown Wine',
//               wineCategory: wineData.category || 'Unknown Category',
//               wineSubcategory: wineData.subcategory || 'Unknown Subcategory',
//               wineFlavors: wineData.flavors.join(', ') || 'No flavors available',
//               wineRegion: wineData.region || 'Unknown Region',
//               wineVintage: wineData.vintage || 'Unknown Vintage',
//           };
//       }

//       // Render the recipe page with the wine data
//       res.render('recipe', { winePairing });

//   } catch (error) {
//       console.error('Error fetching wine data:', error.message);

//       // In case of an error, render with default values
//       winePairing = {
//           wineName: 'Error fetching wine',
//           wineCategory: 'Error fetching category',
//           wineSubcategory: 'Error fetching subcategory',
//           wineFlavors: 'Error fetching flavors',
//           wineRegion: 'Error fetching region',
//           wineVintage: 'Error fetching vintage',
//       };
//       res.render('recipe', { winePairing });
//   }
// };


Wine.find() // Finds all documents in the Wine collection
  .then((wines) => {
    console.log('All Wines:', wines); // Logs all wines
  })
  .catch((err) => {
    console.log('Error fetching wines:', err.message);
  });

module.exports = {
  // getWinePairingAndDescription
};