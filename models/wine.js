const mongoose = require('mongoose');

// Define the wine schema
const wineSchema = new mongoose.Schema({
    name: String,                 // Wine name, e.g., 'Chardonnay'
    category: {                    // Main wine category (white, red, etc.)
        type: String,
        enum: ['white_wine', 'red_wine', 'dessert_wine', 'rose_wine', 'sparkling_wine', 'sherry', 'vermouth', 'fruit_wine', 'mead'],
        required: true
    },
    subcategory: {                 // Specific subcategory (dry, sweet, etc.)
        type: String,
        enum: ['dry', 'sweet', 'semi-dry', 'fortified', 'sparkling'],
        required: true
    },
    flavors: [String],            // List of flavors, e.g., 'fruity', 'spicy'
    region: String,               // Region of the wine (e.g., 'Bordeaux', 'Champagne')
    vintage: Number               // Optional vintage year
});

// Create and export the Wine model
module.exports = mongoose.model('Wine', wineSchema);
