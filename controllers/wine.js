// controllers/wine.js
const axios = require('axios');
const Wine = require('../models/Wine');
const RECIPES_API_KEY = process.env.RECIPES_API_KEY;

const getRandomWineData = async () => {
  try {
    const allWines = await Wine.find();

    const wineNames = allWines.reduce((acc, wine) => {
      Object.values(wine.toObject()).forEach((arr) => {
        if (Array.isArray(arr)) {
          acc.push(...arr);
        }
      });
      return acc;
    }, []);

    if (wineNames.length === 0) {
      throw new Error('No wines found in database');
    }

    const randomWine = wineNames[Math.floor(Math.random() * wineNames.length)];
    console.log('Selected wine:', randomWine);

     // Get wine description
    const descriptionRes = await axios.get(
      'https://api.spoonacular.com/food/wine/description',
      {
        params: {
          wine: randomWine,
          apiKey: RECIPES_API_KEY,
        },
        timeout: 5000, // optional timeout
      }
    );

        // Get wine pairing (for image, price, etc.)
        const pairingRes = await axios.get('https://api.spoonacular.com/food/wine/pairing', {
          params: {
            food: randomWine,
            apiKey: RECIPES_API_KEY,
          },
        });

      // Extract product info
      const product = pairingRes.data.productMatches?.[0]; // Grab first match if exists

    return {
      wine: randomWine,
      description: descriptionRes.data.wineDescription,
      imageUrl: product?.imageUrl || null,
      price: product?.price || null,
      productTitle: product?.title || null,
    };

  } catch (error) {
    console.error('Error in getRandomWineData:', error.response?.data || error.message);
    return {
      wine: 'unknown',
      description: 'No description available.',
      imageUrl: null,
      price: null,
      productTitle: null,
    };
  }
};

module.exports = {
  getRandomWineData,
};
