const mongoose = require('mongoose');

// Define Recipe schema and model
const RecipeSchema = new mongoose.Schema({
    spoonacularId: {
        type: Number, // Store the Spoonacular ID as a number
        required: true,
        unique: true, // Ensure it's unique to avoid duplicates
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    servings: {
        type: Number,
        required: true,
    },
    readyInMinutes: {
        type: Number,
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    ingredients: [{
        name: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            required: true,
        }
    }],
    likes: {
        type: Number,
        default: 0,
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

// MongoDB Collection named here - will give lowercase plural of name 
module.exports = mongoose.model("Recipe", RecipeSchema);
