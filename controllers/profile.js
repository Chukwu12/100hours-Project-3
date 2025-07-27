const axios = require("axios");
const cloudinary = require("../middleware/cloudinary");
const mongoose = require('mongoose');
const Recipe = require("../models/Recipe");
const Favorite = require("../models/Favorite");
const UserRecipe = require('../models/UserRecipe');
const User = require('../models/User');
const Like = require('../models/Like');


module.exports = {
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const userRecipes = await Recipe.find({ user: userId });
      const favoriteDocs = await Favorite.find({ user: userId }).populate("recipe");
      const validFavorites = favoriteDocs.filter(fav => fav.recipe);

      res.render("profile.ejs", {
        user: req.user,
        recipes: userRecipes,
        validFavorites,
      });
    } catch (err) {
      console.error("Error loading profile:", err);
      res.status(500).render("error.ejs", { message: "Error loading profile" });
    }
  },

  toggleFavorite: async (req, res) => {
    try {
      const userId = req.user.id;
      const spoonacularId = req.params.id;

      const existing = await Favorite.findOne({ user: userId, spoonacularId });
      if (existing) {
        await Favorite.findByIdAndDelete(existing._id);
        return res.status(200).json({ message: "Removed from favorites" });
      }

      let recipe = await Recipe.findOne({ spoonacularId });
      if (!recipe) {
        const response = await axios.get(`https://api.spoonacular.com/recipes/${spoonacularId}/information`, {
          params: { apiKey: process.env.RECIPES_API_KEY }
        });

        const r = response.data;
        recipe = await Recipe.create({
          spoonacularId: r.id,
          name: r.title,
          title: r.title,
          image: r.image,
          servings: r.servings,
          readyInMinutes: r.readyInMinutes,
          instructions: r.instructions || '',
          ingredients: r.extendedIngredients?.map(i => ({
            name: i.name,
            amount: i.amount,
            unit: i.unit
          })) || [],
        });
      }

      const favorite = await Favorite.create({
        user: userId,
        recipe: recipe._id,
        spoonacularId
      });

      res.status(201).json({ message: "Added to favorites", favorite });
    } catch (err) {
      console.error("Toggle favorite error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      res.render("recipe.ejs", { recipe, user: req.user });
    } catch (err) {
      console.error("Error fetching recipe:", err);
      res.status(500).send("Error fetching recipe");
    }
  },

  createRecipe: async (req, res) => {
    try {
      // Upload image to Cloudinary
      console.log("🧪 Entered createRecipe");
      console.log("req.file:", req.file);
      console.log("req.body:", req.body);

      // Guard clause if no file
      if (!req.file) {
        console.error("❌ No file uploaded");
        req.flash('error', 'Please upload an image.');
        return res.redirect('/profile');
      }
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log("✅ Cloudinary upload success:", result.secure_url);

      // Create new recipe
      await UserRecipe.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        ingredients: Array.isArray(req.body.ingredients)
          ? req.body.ingredients
          : [req.body.ingredients], // array of strings
        directions: req.body.directions,
        likes: 0,
        user: req.user.id,
        spoonacularId: req.body.spoonacularId
      });

      res.redirect('/profile?success=Recipe created successfully!');
    } catch (err) {
      console.error('🔥 Error in createRecipe:', err); // 🛠 Add this line
      res.redirect('/profile?error=There was an error creating the recipe.');
    }
  },


 likeRecipe: async (req, res) => {
    try {
      const userId = req.user._id;
      const recipeParam = req.params.id;
  
      // Try to find the recipe from either MongoDB or Spoonacular
      let recipe = null;
  
      if (mongoose.Types.ObjectId.isValid(recipeParam)) {
        recipe = await Recipe.findById(recipeParam);
      }
  
      if (!recipe) {
        recipe = await Recipe.findOne({ spoonacularId: recipeParam });
      }
  
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      const recipeIdToSave = recipe._id.toString(); // Save consistent recipe ID as string
  
      // Check if user already liked this recipe
      const existingLike = await Like.findOne({
        user: userId,
        recipeId: recipeIdToSave,
      });
  
      if (existingLike) {
        return res.status(400).json({ message: 'You already liked this recipe' });
      }
  
      // Save like
      await Like.create({ user: userId, recipeId: recipeIdToSave });
  
      // Update like count in the recipe model
      recipe.likes = (recipe.likes || 0) + 1;
      await recipe.save();
  
      res.status(200).json({ message: 'Recipe liked successfully!' });
  
    } catch (err) {
      console.error("Error liking recipe:", err);
      res.status(500).json({ message: "Error liking recipe" });
    }
  },

  deleteFavorite: async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      spoonacularId: req.params.id,
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.status(200).json({ message: 'Favorite deleted' });
  } catch (err) {
    console.error('Delete favorite error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
},

    getUserProfile: async (req, res) => {
      try {
        const userId = req.user._id;
        const favorites = await Favorite.find({ user: userId }).populate("recipe");

        if (!favorites.length) {
          return res.status(404).json({ message: "No favorite recipes found" });
        }

        const favoriteRecipes = favorites.map(fav => fav.recipe);

        res.status(200).json({
          message: "User profile fetched successfully",
          profile: {
            name: req.user.name,
            email: req.user.email,
            favorites: favoriteRecipes,
          },
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
        res.status(500).json({ message: "Server error" });
      }
    },
};
