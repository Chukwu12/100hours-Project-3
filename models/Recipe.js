const mongoose = require('mongoose');

// Define Recipe schema and model
const RecipeSchema = new mongoose.Schema({
    spoonacularId: {
        type: String,
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
        default: 0, // Default to 0 if not provided
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String,
        required: false,
    },
    cloudinaryId: {
        type: String,
        required: false, // Make optional if not using Cloudinary
    },
    directions: {
        type: String,
        required: false,
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// MongoDB Collection named here - will give lowercase plural of name
module.exports = mongoose.model("Recipe", RecipeSchema);
