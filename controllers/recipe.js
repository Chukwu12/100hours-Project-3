// controllers/recipe.js
const axios = require('axios');
const Favorite = require("../models/Favorite");
const Recipe = require("../models/Recipe"); // Assuming you have a Recipe model
const Wine = require('../models/wine'); // Import the wine model
const RECIPES_API_KEY = process.env.RECIPES_API_KEY ;
const RECIPES_API_URL = 'https://api.spoonacular.com/recipes/random';
const RECIPE_DETAILS_API_URL = 'https://api.spoonacular.com/recipes/{id}/information';
const WINE_DESCRIPTION_API  = 'https://api.spoonacular.com/food/wine/description';
const WINE_PARING_API = 'https://api.spoonacular.com/food/wine/pairing';

console.log('API Key:', process.env.RECIPES_API_KEY);

const getRandomRecipes = async () => {
    try {
        if (!RECIPES_API_KEY) {
            throw new Error('API key is missing');
        }

        const response = await axios.get(RECIPES_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 5,
                includeNutrition: true,
                limitLicense: true,
            }
        });

        // Check the response validity
        if (!response || !response.data) {
            throw new Error('Invalid API response');
        }

        // Check for recipes
        if (!response.data.recipes || response.data.recipes.length === 0) {
            throw new Error('No recipes found');
        }

        // Return the recipes
        return response.data.recipes;
    } catch (error) {
        console.error('Error fetching random recipes:', error.message);
        throw new Error(error.message);  // Propagate the error to the calling function
    }
};

module.exports = { getRandomRecipes };




// Fetch detailed recipe information
const getRecipeDetails = async (req, res) => {
    try {
        // Check for API key
        if (!RECIPES_API_KEY) {
            return res.status(401).json({ message: 'API key is missing' });
        }

        const recipeId = req.params.id;
        if (!recipeId) {
            return res.status(400).send('Recipe ID is required');
        }

        // Fetch recipe details from the API
        const response = await axios.get(RECIPE_DETAILS_API_URL.replace('{id}', recipeId), {
            params: {
                apiKey: RECIPES_API_KEY,
            }
        });

        const recipe = response.data;

        // Validate recipe data
        if (!recipe.title || !recipe.image || !recipe.servings || !recipe.readyInMinutes || !recipe.instructions || !Array.isArray(recipe.extendedIngredients)) {
            return res.status(500).send('Recipe data is incomplete');
        }

        // Render the recipe details page
        res.render('recipeInfo', {
            recipe: {
                title: recipe.title,
                image: recipe.image,
                servings: recipe.servings,
                readyInMinutes: recipe.readyInMinutes,
                instructions: recipe.instructions,
                ingredients: recipe.extendedIngredients
            }
        });
    } catch (error) {
        console.error('Error fetching recipe details:', error.message);
        if (error.response && error.response.status === 404) {
            return res.status(404).send('Recipe not found');
        }
        res.status(500).send('Error fetching recipe details');
    }
};



const favoriteRecipe = async (req, res) => {
    try {
      // Get the spoonacularId from the request parameters
      const spoonacularId = req.params.id;
  
      // First, find the recipe by its spoonacularId
      const recipe = await Recipe.findOne({ spoonacularId: spoonacularId });
  
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      // Now create a new favorite with the recipe's MongoDB ObjectId
      const favorite = await Favorite.create({
        user: req.user.id,       // assuming the user is attached to the request (via authentication)
        recipe: recipe._id,      // Store the MongoDB ObjectId (not the spoonacularId)
        spoonacularId: spoonacularId,  // Still store the spoonacularId for external reference
      });
  
      console.log('Favorite has been added!');
      res.redirect(`/recipe/${spoonacularId}`);  // Redirect to the recipe page (using the spoonacularId)
  
    } catch (err) {
      console.error('Error adding favorite:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  const likeRecipe = async (req, res) => {
    try {
      const spoonacularId = req.params.id;  // Spoonacular ID from URL parameter
  
      // Find the recipe by its spoonacularId and increment the likes by 1
      const recipe = await Recipe.findOneAndUpdate(
        { spoonacularId: spoonacularId },   // Match by spoonacularId
        { $inc: { likes: 1 } },              // Increment the likes field
        { new: true }                        // Return the updated recipe
      );
  
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });  // Return 404 if recipe is not found
      }
  
      // Return the updated recipe
      res.status(200).json({ message: 'Recipe liked successfully!', recipe });
    } catch (err) {
      console.error('Error liking recipe:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  

const saveRecipe = async (recipeData) => {
    const { id, servings, readyInMinutes, instructions, ingredients, likes = 0, user, createdAt = new Date() } = recipeData;

     // Create a new Recipe instance
     const newRecipe = new Recipe({
        spoonacularId: id, // Use the Spoonacular ID
        servings,
        readyInMinutes,
        instructions, // Ensure this field is included
        ingredients, // Directly assign the ingredients array
        likes,
        user,
        createdAt,
        // Other fields can be added here if needed
    });
    
    try {
        const savedRecipe = await newRecipe.save(); // Save to the database
        console.log('Recipe saved successfully:', savedRecipe);
        return savedRecipe; // Return the saved recipe
    } catch (error) {
        console.error('Error saving recipe:', error.message);
        throw new Error('Could not save recipe'); // Rethrow for further handling
    }
};


   // Function to get a recipe by Spoonacular ID
   const getRecipeBySpoonacularId = async (spoonacularId) => {
    try {
        const recipe = await Recipe.findOne({ spoonacularId });
        if (!recipe) {
            throw new Error('Recipe not found');
        }
        return recipe;
    } catch (error) {
        console.error('Error retrieving recipe:', error.message);
    }
};

 const deleteRecipe = async (req, res) => {
    try {
      // Find post by id
      let recipe = await Recipe.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(recipe.cloudinaryId);
      // Delete post from db
      await Recipe.remove({ _id: req.params.id });
      console.log("Deleted Recipe");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  };
 // Fetch a random wine from your local database

// Function to get a random wine pairing and description
// async function getRandomWinePairingAndDescription(req, res) {
//     try {
//         // Fetch a random wine from your local database
//         const wineData = await Wine.aggregate([{ $sample: { size: 1 } }]);

//         if (wineData.length === 0) {
//             return res.render('recipe', {
//                 randomWinePairing: {
//                     wineName: 'No wine found',
//                     wineDescription: 'No description available for this wine',
//                     dishPairing: 'No dish pairing found'
//                 }
//             });
//         }

//         const wine = wineData[0];  // Select the random wine
//         const wineName = wine.name || 'Unknown Wine';  // If name exists, use it; otherwise, default

//         // Fetch wine description from Spoonacular API
//         const wineDescription = await getWineDescription(wineName);

//         // Fetch food pairing suggestion for the wine from Spoonacular API
//         const dishPairing = await getWinePairing(wineName);

//         // Render the response with the wine, dish pairing, and description
//         res.render('recipe', {
//             randomWinePairing: {
//                 wineName: wine.name,
//                 wineDescription: wineDescription,
//                 dishPairing: dishPairing
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching wine pairing and description:', error.message);
//         res.render('recipe', {
//             randomWinePairing: {
//                 wineName: 'Error fetching wine pairing',
//                 wineDescription: 'Error fetching wine description',
//                 dishPairing: 'Error fetching dish pairing'
//             }
//         });
//     }
// }

// Function to fetch wine description from Spoonacular API
// const getWineDescription = async (wineName) => {
//     try {
//         const response = await axios.get(WINE_DESCRIPTION_API, {
//             params: {
//                 apiKey: RECIPES_API_KEY,
//                 wine: wineName
//             }
//         });

//         if (response.data && response.data.description) {
//             return response.data.description;
//         } else {
//             return 'No description available for this wine';
//         }
//     } catch (error) {
//         console.error('Error fetching wine description:', error.message);
//         return 'Error fetching wine description';
//     }
// };

// Function to fetch wine pairing (dish pairing) from Spoonacular API
// const getWinePairing = async (wineName) => {
//     try {
//         const response = await axios.get(WINE_PARING_API, {
//             params: {
//                 apiKey: RECIPES_API_KEY,
//                 wine: wineName
//             }
//         });

//         if (response.data && response.data.pairingText) {
//             return response.data.pairingText; // The pairing text returned by Spoonacular
//         } else {
//             return 'No pairing found for this wine';
//         }
//     } catch (error) {
//         console.error('Error fetching wine pairing:', error.message);
//         return 'Error fetching dish pairing';
//     }
// };



module.exports = {
     getRandomRecipes,
    getRecipeDetails, 
    favoriteRecipe,
    likeRecipe,
    saveRecipe,
    getRecipeBySpoonacularId, 
    deleteRecipe,  
    // getRandomWinePairingAndDescription,
    // getWinePairing,
    // getWineDescription,  
};
