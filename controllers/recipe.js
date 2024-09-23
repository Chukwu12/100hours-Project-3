// controllers/recipe.js
const axios = require('axios');
const Favorite = require("../models/Favorite");
const Recipe = require("../models/Recipe"); // Assuming you have a Recipe model

require('dotenv').config({ path: './config/.env' });
const RECIPES_API_KEY = process.env.RECIPES_API_KEY;
const RECIPES_API_URL = 'https://api.spoonacular.com/recipes/random';
const RECIPE_DETAILS_API_URL = 'https://api.spoonacular.com/recipes/{id}/information';

console.log('API Key:', process.env.RECIPES_API_KEY);
const getRandomRecipes = async (req, res) => {
    try {
        // Check if the API key is available
        if (!RECIPES_API_KEY) {
            return res.status(401).json({ message: 'API key is missing' });
        }
        
        // Make the API request with the API key in the headers
        const response = await axios.get(RECIPES_API_URL, {
            params: {
                apiKey: RECIPES_API_KEY,
                number: 5,  // Number of random recipes to fetch
                includeNutrition: true,
                limitLicense: true,
            }
        });
        //console.log('API Response:', response.data); // Log response for debugging
        
        // Extract recipes and add the readyInMinutes field
        const recipes = response.data.recipes.map(recipe => ({
            ...recipe,
            servings: recipe.servings,  // Get the number of servings
            readyInMinutes: recipe.readyInMinutes,  // Get the preparation time
            numberOfIngredients: recipe.extendedIngredients.length,  // Number of ingredients
            instructions: recipe.instructions,
            spoonacularId: recipe.id, // Save the Spoonacular ID
        
        }));

         // Use insertMany for batch processing
         await Recipe.insertMany(recipes);
         console.log('Recipes saved successfully');
        
        return recipes;
      } catch (error) {
        console.error('Error fetching random recipes:', error.message);
        res.status(500).json({ message: 'Error fetching random recipes' });
    }
};


// Fetch detailed recipe information
const getRecipeDetails = async (req, res) => {
  try {
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



const favoriteRecipe = async (req, res) => {
    try {
      //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content 
      await Favorite.create({
        user: req.user.id,
        recipe: req.params.id,
      });
      console.log("Favorite has been added!");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  }

  const likeRecipe = async (req, res) => {
    try {
        const spoonacularId = req.params.id;  // This should be the MongoDB ObjectId

        // Find the recipe by ID and increment the likes
        const recipe = await Recipe.findOneAndUpdate(
            { spoonacularId: spoonacularId }, // Use spoonacularId here
            { $inc: { likes: 1 } }, // Increment likes
            { new: true } // Return the updated recipe
        );

        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }

     // Return the updated recipe
     return res.status(200).json(recipe);
    } catch (error) {
        console.error('Error liking recipe:', error.message);
        res.status(500).send('Error liking recipe');
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




module.exports = {
    getRandomRecipes,
    getRecipeDetails, 
    favoriteRecipe,
    likeRecipe,
    saveRecipe,
    getRecipeBySpoonacularId,   
};
