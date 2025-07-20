const mongoose = require('mongoose');

const UserRecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  cloudinaryId: {
    type: String,
    required: false,
  },
  ingredients: {
    type: [String], // simpler structure
    required: true,
  },
  directions: {
    type: String,
    required: true,
  },
  spoonacularId: {
    type: String,
    required: false,
  },
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('UserRecipe', UserRecipeSchema);
