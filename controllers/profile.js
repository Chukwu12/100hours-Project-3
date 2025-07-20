const axios = require("axios");
const cloudinary = require("../middleware/cloudinary");
const Recipe = require("../models/Recipe");
const Favorite = require("../models/Favorite");
const UserRecipe = require('../models/UserRecipe');


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
      const result = await cloudinary.uploader.upload(req.file.path);
      // Create user-submitted recipe using new schema
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

      req.flash('success', 'Recipe created successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error('🔥 Error in createRecipe:', err); // 🛠 Add this line
    req.flash('error', 'There was an error creating the recipe.');
    res.redirect('/profile');
  }
},



  likeRecipe: async (req, res) => {
    try {
      await Recipe.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
      console.log("Likes +1");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.error("Error liking recipe:", err);
      res.status(500).send("Error liking recipe");
    }
  },

  deleteRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) return res.status(404).send("Recipe not found");
      await cloudinary.uploader.destroy(recipe.cloudinaryId);
      await Recipe.findByIdAndDelete(req.params.id);
      console.log("Deleted Recipe");
      res.redirect("/profile");
    } catch (err) {
      console.error("Error deleting recipe:", err);
      res.status(500).send("Error deleting recipe");
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
