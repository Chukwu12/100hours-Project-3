const mongoose = require('mongoose');

// Define the wine schema
const wineSchema = new mongoose.Schema({
    white_wine: {
        dry_white_wine: [String],
        mueller_thurgau: [String],
        grechetto: [String],
        gewurztraminer: [String],
        chenin_blanc: [String],
        // Add other white wine categories...
    },
    red_wine: {
        dry_red_wine: [String],
        bordeaux: [String],
        marsala: [String],
        port: [String],
        // Add other red wine categories...
    },
    dessert_wine: [String],
    rose_wine: [String],
    sparkling_wine: [String],
    sherry: [String],
    vermouth: [String],
    fruit_wine: [String],
    mead: [String]
});

// Create and export the Wine model
module.exports = mongoose.model('Wine', wineSchema);
