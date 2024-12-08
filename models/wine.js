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
    
    // List of wine types (e.g., 'chardonnay', 'pinot_noir', etc.)
    types: [
        { 
            type: String,  // Specific wine type (e.g., 'assyrtiko', 'pinot_grigio')
            required: true
        }
    ],

    // List of flavors associated with the wine (e.g., 'fruity', 'spicy', etc.)
    flavors: [String], // e.g., ['fruity', 'spicy']

    // Wine region (e.g., 'Bordeaux', 'Champagne')
    region: String, // Optional

    // Vintage year (Optional)
    vintage: Number // Optional
});

// Export the Wine model using the defined schema
module.exports = mongoose.model('Wine', wineSchema);
