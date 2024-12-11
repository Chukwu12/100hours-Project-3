const mongoose = require("mongoose");


const FavoriteSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe", // Reference to the Recipe model
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
  },
  spoonacularId: {
    type: String, // Add spoonacularId field to store external reference
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Enforce uniqueness of recipe per user
FavoriteSchema.index({ user: 1, spoonacularId: 1 }, { unique: true });


//MongoDB Collection named here - will give lowercase plural of name 
module.exports = mongoose.model("Favorite", FavoriteSchema);