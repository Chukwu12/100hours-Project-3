// controllers/recipe.js
const axios = require('axios');
const Favorite = require("../models/Favorite");
const Recipe = require("../models/Recipe"); // Assuming you have a Recipe model


const RECIPES_API_KEY = process.env.RECIPES_API_KEY || '15b2edef64f24d2c95b3cc72e3ad8f87';
const RECIPES_API_URL = 'https://api.spoonacular.com/recipes/random';
const RECIPE_DETAILS_API_URL = 'https://api.spoonacular.com/recipes/{id}/information';


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
        console.log('API Response:', response.data); // Log response for debugging
        
        // Extract recipes and add the readyInMinutes field
        const recipes = response.data.recipes.map(recipe => ({
            ...recipe,
            servings: recipe.servings,  // Get the number of servings
            readyInMinutes: recipe.readyInMinutes,  // Get the preparation time
            numberOfIngredients: recipe.extendedIngredients.length  // Number of ingredients
        }));
        
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
          await Recipe.findOneAndUpdate(
            { _id: req.params.id },
            {
              $inc: { likes: 1 },
            }
          );
          console.log("Likes +1");
          res.redirect(`/recipe/${req.params.id}`);
        } catch (err) {
          console.log(err);
        }
    }

    const getFavorites = async (req, res) => { 
        console.log(req.user)
        try {
          //Since we have a session each request (req) contains the logged-in users info: req.user
          //console.log(req.user) to see everything
          //Grabbing just the posts of the logged-in user
          const recipes = await Favorite.find({ user: req.user.id }).populate('recipe');
    
          console.log(recipes)
    
          //Sending post data from mongodb and user data to ejs template
          res.render("favorites.ejs", { recipes: recipes, user: req.user });
        } catch (err) {
          console.log(err);
        }
      }

    const deleteRecipe = async (req, res) => {
        try {
          // Find post by id
          let recipe = await recipe.findById({ _id: req.params.id });
          // Delete image from cloudinary
          await cloudinary.uploader.destroy(recipe.cloudinaryId);
          // Delete post from db
          await Recipe.remove({ _id: req.params.id });
          console.log("Deleted Recipe");
          res.redirect("/profile");
        } catch (err) {
          res.redirect("/profile");
        }
      }
  

module.exports = {
    getRandomRecipes,
    getRecipeDetails,
    favoriteRecipe,
    likeRecipe,
    getFavorites,
    deleteRecipe,  
};
