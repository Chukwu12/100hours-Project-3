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
      const requiredRecipes = 5;

      // Step 1: Fetch recipes from MongoDB
      let recipes = await Recipe.aggregate([
          { $match: { image: { $exists: true, $ne: null } } }, // Ensure recipes have an image
          { $sample: { size: requiredRecipes } }              // Get a random sample
      ]);

      // Step 2: If MongoDB doesn't have enough recipes, fetch from the API
      if (recipes.length < requiredRecipes) {
          console.log(`Found ${recipes.length} recipes in MongoDB. Fetching more from API...`);

          const remainingCount = requiredRecipes - recipes.length;

          const response = await axios.get(RECIPES_API_URL, {
              params: {
                  apiKey: RECIPES_API_KEY,
                  number: remainingCount,
                  includeNutrition: true,
                  limitLicense: true,
              }
          });

          if (response && response.data && response.data.recipes) {
              const apiRecipes = response.data.recipes.filter(recipe => recipe.image);

              // Save new API recipes to MongoDB
              const savedRecipes = await Recipe.insertMany(
                  apiRecipes.map(recipe => ({
                      spoonacularId: recipe.id,
                      title: recipe.title,
                      image: recipe.image,
                      instructions: recipe.instructions || '',
                      servings: recipe.servings,
                      readyInMinutes: recipe.readyInMinutes,
                      ingredients: recipe.extendedIngredients?.map(ing => ing.original) || [],
                  })),
                  { ordered: false } // Ignore duplicate errors if recipes already exist
              );

              console.log(`Fetched and saved ${savedRecipes.length} recipes from API.`);

              // Add the newly fetched recipes to the final result
              recipes = recipes.concat(savedRecipes);
          } else {
              console.log('No recipes found from API.');
          }
      }

      // Step 3: Return the final combined list of recipes
      return recipes;
  } catch (error) {
      console.error('Error fetching random recipes:', error.message);
      throw new Error(error.message);
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


  const favoriteRecipe = async (req, res) => {
    try {
        const { id: spoonacularId } = req.params;

        // Try to find the recipe in MongoDB by spoonacularId
        let recipe = await Recipe.findOne({ spoonacularId });

        // If the recipe isn't found in the database, fetch it from the API and save it
        if (!recipe) {
            const response = await axios.get(`https://api.spoonacular.com/recipes/${spoonacularId}/information`, {
                params: { apiKey: RECIPES_API_KEY },
            });

            if (response && response.data) {
                const apiRecipe = response.data;

                // Create a new recipe document using the API data
                recipe = new Recipe({
                    spoonacularId: apiRecipe.id,
                    title: apiRecipe.title,
                    image: apiRecipe.image,
                    instructions: apiRecipe.instructions || '',
                    servings: apiRecipe.servings,
                    readyInMinutes: apiRecipe.readyInMinutes,
                    ingredients: apiRecipe.extendedIngredients?.map(ing => ing.original) || [],
                });

                // Save the recipe to MongoDB
                await recipe.save();
            } else {
                return res.status(404).json({ message: 'Recipe not found in API or database' });
            }
        }

        // Check if the user has already favorited this recipe
        const existingFavorite = await Favorite.findOne({
            user: req.user.id,
            recipe: recipe._id,  // Use MongoDB _id here
        });

        if (existingFavorite) {
            return res.status(400).json({ message: 'You have already favorited this recipe' });
        }

        // Create a new favorite for the user
        const favorite = await Favorite.create({
            user: req.user.id,
            recipe: recipe._id,  // Store MongoDB _id as the reference
            spoonacularId: recipe.spoonacularId,  // Keep the spoonacularId for external reference
        });

        res.status(201).json({
            message: 'Recipe has been added to favorites!',
            favorite,
        });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const fetchFavorite = async (req, res) => {
    try {
      const userId = req.user.id; // Ensure the user is authenticated

          // Fetch the user's favorite recipes
      const favorites = await Favorite.find({ user: userId })
        .populate('recipe', 'title image ingredients')
        .select('createdAt spoonacularId');
        console.log(favorites);
  
        // Render the profile page with the fetched favorites
      res.render('profile', { user: req.user, favorites }); // Pass `favorites` to the template
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching favorites.');
    }
  };
  
  


  
  

const likeRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
    }

    // Increment the like count (if likes field exists)
    recipe.likes = (recipe.likes || 0) + 1;
    await recipe.save();

    res.status(200).json({ message: 'Recipe liked successfully!' });
} catch (error) {
    console.error('Error liking recipe:', error);
    res.status(500).json({ message: 'Error liking recipe' });
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
        // Check MongoDB for the recipe first
        let recipe = await Recipe.findOne({ spoonacularId });

        if (!recipe) {
            console.log('Recipe not found in database. Fetching from API...');
            
            // Fetch the recipe from the API
            const response = await axios.get(`https://api.spoonacular.com/recipes/${spoonacularId}/information`, {
                params: {
                    apiKey: RECIPES_API_KEY,
                }
            });

            if (response && response.data) {
                const apiRecipe = response.data;

                // Save the recipe to MongoDB
                recipe = new Recipe({
                    spoonacularId: apiRecipe.id,
                    title: apiRecipe.title,
                    image: apiRecipe.image,
                    instructions: apiRecipe.instructions,
                    servings: apiRecipe.servings,
                    readyInMinutes: apiRecipe.readyInMinutes,
                    ingredients: apiRecipe.extendedIngredients.map(ing => ing.original),
                });

                await recipe.save();
                console.log('Recipe saved to database');
            } else {
                throw new Error('Recipe not found from API');
            }
        }

        return recipe;
    } catch (error) {
        console.error('Error retrieving recipe:', error.message);
        throw new Error(error.message);
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
    fetchFavorite,
    likeRecipe,
    saveRecipe,
    getRecipeBySpoonacularId, 
    deleteRecipe,  
};
