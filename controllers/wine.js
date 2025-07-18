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

    let tries = 0;
    let randomWine = null;
    let descriptionRes = null;
    let product = null;

    // Try up to 5 wines until we get a valid product recommendation
    while (!product && tries < 5) {
      tries++;
      randomWine = wineNames[Math.floor(Math.random() * wineNames.length)];
      console.log('Selected wine:', randomWine);

      try {
        // Get wine description
        descriptionRes = await axios.get('https://api.spoonacular.com/food/wine/description', {
          params: {
            wine: randomWine,
            apiKey: RECIPES_API_KEY,
          },
        });

        // Get wine product recommendation
        const recommendationRes = await axios.get('https://api.spoonacular.com/food/wine/recommendation', {
          params: {
            wine: randomWine,
            number: 1,
            apiKey: RECIPES_API_KEY,
          },
        });

        product = recommendationRes.data.recommendedWines?.[0];

        if (product) {
          return {
            wine: randomWine,
            description: descriptionRes.data.wineDescription,
            imageUrl: product.imageUrl,
            price: product.price,
            productTitle: product.title,
            link: product.link || null,
            averageRating: product.averageRating || null,
          };
          
        }
      } catch (innerError) {
        console.warn(`Try ${tries} failed for wine "${randomWine}":`, innerError.response?.data?.message || innerError.message);
      }
    }

    // If no valid wine with product found after 5 tries
    return {
      wine: randomWine || 'unknown',
      description: descriptionRes?.data?.wineDescription || 'No description available.',
      imageUrl: null,
      price: null,
      productTitle: null,
      link: null,
    };

  } catch (error) {
    console.error('Error in getRandomWineData:', error.response?.data || error.message);
    return {
      wine: 'unknown',
      description: 'No description available.',
      imageUrl: null,
      price: null,
      productTitle: null,
      link: null,
    };
  }
};

module.exports = {
  getRandomWineData,
};
