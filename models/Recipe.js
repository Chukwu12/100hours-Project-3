const mongoose = require('mongoose');

// Define Recipe schema and model
const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        require: true,
      },
      cloudinaryId: {
        type: String,
        require: true,
      },
      ingredients: {
        type: String,
        required: true,
      },
      directions: {
        type: String,
        required: true,
      },
      likes: {
        type: Number,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

//MongoDB Collection named here - will give lowercase plural of name 
module.exports = mongoose.model("Recipe", RecipeSchema);

