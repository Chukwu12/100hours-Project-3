const mongoose = require('mongoose');

const wineSchema = new mongoose.Schema({
  white_wine: {
    dry_white_wine: [String],
    mueller_thurgau: [String],
    grechetto: [String],
    gewurztraminer: [String],
    chenin_blanc: [String],
    white_bordeaux: [String],
    semillon: [String],
    riesling: [String],
    sauterne: [String],
    sylvaner: [String],
    lillet_blanc: [String]
  },
  red_wine: {
    dry_red_wine: [String],
    bordeaux: [String],
    marsala: [String],
    port: [String],
    gamay: [String],
    dornfelder: [String],
    concord_wine: [String],
    sparkling_red_wine: [String],
    pinotage: [String],
    agiorgitiko: [String]
  },
  dessert_wine: [String],
  rose_wine: [String],
  sparkling_wine: [String],
  sherry: [String],
  vermouth: [String],
  fruit_wine: [String],
  mead: [String]
});

// Create and export the model
const Wine = mongoose.model('Wine', wineSchema);

module.exports = Wine;
