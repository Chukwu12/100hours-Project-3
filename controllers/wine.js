const axios = require('axios');
const Wine = require('../models/Wine'); // Import the wine model
const WINE_DESCRIPTION_API  = 'https://api.spoonacular.com/food/wine/description';
const WINE_PARING_API = 'https://api.spoonacular.com/food/wine/pairing';
const RECIPES_API_KEY = '479270df5629469ab4974af598b4474d'

// Function to fetch the wine description from Spoonacular API
const getRandomWinePairingAndDescription = async (req, res) => {
    let randomWinePairing = {};

    try {
        // Fetch a random wine from your local database
        const wineData = await Wine.aggregate([{ $sample: { size: 1 } }]);  // Randomly sample one wine from the database

        if (wineData.length === 0) {
            // If no wine is found in the database
            randomWinePairing = {
                wineName: 'No wine found',
                wineCategory: 'No category available',
                wineSubcategory: 'No subcategory available',
                wineFlavors: 'No flavors available',
                wineRegion: 'No region available',
                wineVintage: 'No vintage available',
                wineDescription: 'No description available',
                winePairing: 'No pairing available',
            };
        } else {
             // Step 2: Get wine data from the database
      const wine = wineData[0];
      const wineName = wine.name;

      randomWinePairing = {
        wineName: wine.name || 'Unknown Wine',
        wineCategory: wine.category || 'Unknown Category',
        wineSubcategory: wine.subcategory || 'Unknown Subcategory',
        wineFlavors: wine.flavors.join(', ') || 'No flavors available',
        wineRegion: wine.region || 'Unknown Region',
        wineVintage: wine.vintage || 'Unknown Vintage',
      };

       // Step 3: Fetch wine description from Spoonacular API using the wine name
       const wineDescriptionResponse = await axios.get(WINE_DESCRIPTION_API, {
        params: {
          apiKey: RECIPES_API_KEY,
          wine: wineName,
        },
      });

       // Step 4: Fetch wine pairing from Spoonacular API
       const winePairingResponse = await axios.get(WINE_PARING_API, {
        params: {
          apiKey: RECIPES_API_KEY,
          wine: wineName,
        },
      });

          // Add description and pairing data to randomWinePairing
          randomWinePairing.wineDescription = wineDescriptionResponse.data.text || 'No description available';
          randomWinePairing.winePairing = winePairingResponse.data.pairings && winePairingResponse.data.pairings.length > 0
            ? winePairingResponse.data.pairings.join(', ')
            : 'No dish pairing available';
        }

         // Step 5: Render the data in the EJS template
    res.render('recipe', { randomWinePairing });

} catch (error) {
  console.error('Error fetching data:', error.message);

   // If there's an error, send a default error response
   randomWinePairing = {
    wineName: 'Error fetching wine pairing',
    wineCategory: 'Error fetching category',
    wineSubcategory: 'Error fetching subcategory',
    wineFlavors: 'Error fetching flavors',
    wineRegion: 'Error fetching region',
    wineVintage: 'Error fetching vintage',
    wineDescription: 'Error fetching description',
    winePairing: 'Error fetching pairing',
  };
  res.render('recipe', { randomWinePairing });
}
};


     
module.exports = {
 getRandomWinePairingAndDescription,
};