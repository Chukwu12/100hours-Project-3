const mongoose = require('mongoose');

// Define Recipe schema and model
const recipeSchema = new mongoose.Schema({
    title: String,
    cuisine: String,
    // Add other fields as needed
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
