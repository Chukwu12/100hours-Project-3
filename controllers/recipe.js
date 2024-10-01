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
        if (!RECIPES_API_KEY) {
            return res.status(401).json({ message: 'API key is missing' });
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
            return res.status(500).json({ message: 'Invalid API response' });
        }

        // Check for recipes
        if (!response.data.recipes || response.data.recipes.length === 0) {
            return res.status(404).json({ message: 'No recipes found' });
        }

        // Process recipes...
        return response.data.recipes || []; 
    } catch (error) {
        console.error('Error fetching random recipes:', error);
        return res.status(500).json({ message: 'Error fetching random recipes', error: error.message });
    }
};



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
