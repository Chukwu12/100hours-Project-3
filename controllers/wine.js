const Wine = require('../models/Wine');
const axios = require('axios');
const RECIPES_API_KEY = process.env.RECIPES_API_KEY;

const WINE_DESCRIPTION_API = 'https://api.spoonacular.com/food/wine/description';
const WINE_PARING_API = 'https://api.spoonacular.com/food/wine/pairing';

const getRandomWineInfo = async () => {
  try {
    // Get the single wine document
    const wineDoc = await Wine.findOne();

    if (!wineDoc) throw new Error('No wine data found');

    // Flatten all nested wine arrays into one array
    const allWines = Object.values(wineDoc.toObject()).flatMap(value =>
      typeof value === 'object' && !Array.isArray(value)
        ? Object.values(value).flat()
        : Array.isArray(value)
        ? value
        : []
    );

    const randomWine = allWines[Math.floor(Math.random() * allWines.length)];

    const [descRes, pairRes] = await Promise.all([
      axios.get(WINE_DESCRIPTION_API, {
        params: { wine: randomWine, apiKey: RECIPES_API_KEY },
      }),
      axios.get(WINE_PARING_API, {
        params: { food: randomWine, apiKey: RECIPES_API_KEY },
      }),
    ]);

    return {
      wine: randomWine,
      description: descRes.data.wineDescription || 'No description found.',
      pairings: pairRes.data.pairedWines || [],
    };
  } catch (err) {
    console.error('Wine selection error:', err.message);
    return {
      wine: 'Unknown',
      description: 'Wine info currently unavailable.',
      pairings: [],
    };
  }
};

module.exports = { getRandomWineInfo };
