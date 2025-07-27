const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true }
, // now supports both _id and spoonacularId
}, { timestamps: true });

module.exports = mongoose.model('Like', LikeSchema);
