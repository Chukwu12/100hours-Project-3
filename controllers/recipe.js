// controllers/recipe.js
const axios = require('axios');
const Favorite = require("../models/Favorite");
const Recipe = require("../models/Recipe"); // Assuming you have a Recipe model
// const Wine = require('../models/Wine'); // Import the wine model
const RECIPES_API_KEY = process.env.RECIPES_API_KEY ;
const RECIPES_API_URL = 'https://api.spoonacular.com/recipes/random';
const RECIPE_DETAILS_API_URL = 'https://api.spoonacular.com/recipes/{id}/information';


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

      
        // Filter recipes to return only those with an image
        const recipesWithImage = response.data.recipes.filter(recipe => recipe.image);

        // Return the filtered recipes
        return recipesWithImage;
    } catch (error) {
        console.error('Error fetching random recipes:', error);  // Log the full error object
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
        console.log('API Response:', response.data); // Add this line to log the full response
        const recipe = response.data;
  
        // Validate that the recipe data contains the expected fields
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
        res.status(500).send('Error fetching recipe details');
    }
  };


  const favoriteRecipe = async (userId, recipeId) => {
    try {
      // Try to find the recipe in the MongoDB collection first
      let recipe = await Recipe.findOne( recipeId );
  
      // If the recipe is not found in MongoDB, fetch it from the API
      if (!recipe) {
        console.log('Recipe not found in MongoDB, fetching from API...');
        const apiRecipe = await getRecipeBySpoonacularId(recipeId); // Fetch from API
        if (!apiRecipe || !apiRecipe.data) {
            throw new Error('Error fetching recipe from the API');
        }
        recipe = await saveRecipe(apiRecipe.data); // Save the recipe to MongoDB
        console.log('Recipe saved to MongoDB!');
      }
  
      // Check if the user has already favorited this recipe
      let favorite = await Favorite.findOne({  user: userId, recipe: recipe._id  });
  
      if (!favorite) {
        // If not, create a new favorite entry
        favorite = new Favorite({
          user: userId,
          recipe: recipe._id, // Use the _id of the saved recipe
          spoonacularId: recipe.spoonacularId, // Store spoonacularId for reference
        });
  
        await favorite.save(); // Save the favorite to MongoDB
        console.log('Recipe favorited successfully!');
      } else {
        console.log('Recipe is already favorited!');
      }
  
      return recipe; // Return the recipe (could also return the favorite if needed)
  
    } catch (error) {
      console.error('Error favoriting recipe:', error.message);
      throw new Error('Error favoriting recipe');
    }
  };
  


const likeRecipe = async (recipeId) => {
    try {
        // Try to find the recipe in the MongoDB collection first
        let recipe = await Recipe.findOne({ spoonacularId: recipeId });

        // If not found, fetch from API and save to MongoDB
        if (!recipe) {
            console.log('Recipe not found in MongoDB, fetching from API...');
            const apiRecipe = await getRecipeBySpoonacularId(recipeId); // Fetch from API
            apiRecipe.likes = 1; // Set initial likes
            recipe = await saveRecipe(apiRecipe); // Save to MongoDB
            console.log('Recipe liked and saved!');
        } else {
            console.log('Recipe found in MongoDB, updating likes...');
            // Update the likes if the recipe is found in MongoDB
            recipe.likes += 1;
            await recipe.save();
            console.log('Recipe liked successfully!');
        }

        return recipe;

    } catch (error) {
        console.error('Error liking recipe:', error.message);
        throw new Error('Error liking recipe');
    }
};


const saveRecipe = async (recipeData) => {
    const { id, servings, readyInMinutes, instructions, ingredients, likes = 0, user, createdAt = new Date() } = recipeData;

    // Create a new Recipe instance
    const newRecipe = new Recipe({
        spoonacularId: id, // Store the Spoonacular ID as a reference
        servings,
        readyInMinutes,
        instructions,
        ingredients, // Directly assign the ingredients array
        likes,
        user,
        createdAt,
        // Other fields can be added here if needed
    });

    try {
        const savedRecipe = await newRecipe.save(); // Save to the database
        console.log('Recipe saved successfully:', savedRecipe);
        return savedRecipe; // Return the saved recipe with MongoDB's _id
    } catch (error) {
        console.error('Error saving recipe:', error.message);
        throw new Error('Could not save recipe'); // Rethrow for further handling
    }
};



   // Function to get a recipe by Spoonacular ID
   const getRecipeBySpoonacularId = async (spoonacularId) => {
    try {
        // Attempt to find the recipe in MongoDB first
        let recipe = await Recipe.findOne({ spoonacularId });

        if (!recipe) {
            // If the recipe is not found in the database, fetch it from Spoonacular
            console.log('Fetching recipe from Spoonacular API...');
            const response = await axios.get(`https://api.spoonacular.com/recipes/${spoonacularId}/information`, {
                params: {
                    apiKey: RECIPES_API_KEY,
                },
            });

            if (!response.data) {
                throw new Error('Recipe data not found from Spoonacular');
            }

            // Assuming the response contains the full recipe details, save it to MongoDB
            recipe = await Recipe.create({
                spoonacularId: spoonacularId,
                title: response.data.title,
                image: response.data.image,
                servings: response.data.servings,
                readyInMinutes: response.data.readyInMinutes,
                instructions: response.data.instructions,
                ingredients: response.data.extendedIngredients,
                likes: 0, // Start with 0 likes
                user: null, // Set user if needed
            });
            console.log('Recipe saved to MongoDB');
        }

        return recipe;
    } catch (error) {
        console.error('Error retrieving recipe by Spoonacular ID:', error.message);
        throw error;
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




module.exports = {
    getRandomRecipes,
    getRecipeDetails, 
    favoriteRecipe,
    likeRecipe,
    saveRecipe,
    getRecipeBySpoonacularId, 
    deleteRecipe,  
};
