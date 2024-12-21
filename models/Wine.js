const mongoose = require('mongoose');

const wineSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., 'Chardonnay'
    
    // Wine category (e.g., 'white_wine', 'red_wine')
    category: { 
        type: String,
        enum: ['white_wine', 'red_wine', 'dessert_wine', 'rose_wine', 'sparkling_wine', 'sherry', 'vermouth', 'fruit_wine', 'mead'],
        required: true
    },
    
    // Wine subcategory (e.g., 'dry_white_wine', 'sweet_white_wine')
    subcategory: { 
        type: String,
        required: true
    },

    // Wine types grouped by subcategory (using a Map for efficiency)
    types: {
        type: Map,
        of: [String], // Map of subcategory to array of wine types
        required: true
    },

    // Wine description (from Spoonacular API)
    description: { 
        type: String, 
        required: false
    },

    // Wine pairing (dishes that go well with this wine)
    pairing: [{ 
        type: String,  // e.g., ['grilled chicken', 'salmon']
        required: false
    }]
});

// Export the Wine model using the defined schema
module.exports = mongoose.model('Wine', wineSchema);
