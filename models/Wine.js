const mongoose = require('mongoose');

const wineSchema = new mongoose.Schema({
  white_wine: {
    dry_white_wine: {
      type: [String],
      required: false,
      default: [
        'assyrtiko', 'pinot_blanc', 'cortese', 'roussanne', 'moschofilero', 'muscadet',
        'viognier', 'verdicchio', 'greco', 'marsanne', 'white_burgundy', 'chardonnay',
        'gruener_veltliner', 'white_rioja', 'frascati', 'gavi', 'l_acadie_blanc', 'trebbiano',
        'sauvignon_blanc', 'catarratto', 'albarino', 'arneis', 'verdejo', 'vermentino', 'soave',
        'pinot_grigio', 'dry_riesling', 'torrontes'
      ]
    },
    mueller_thurgau: { type: [String], required: false },
    grechetto: { type: [String], required: false },
    gewurztraminer: { type: [String], required: false },
    chenin_blanc: { type: [String], required: false },
    lillet_blanc: { type: [String], required: false },
    riesling: { type: [String], required: false },
    sauterne: { type: [String], required: false },
    semillon: { type: [String], required: false },
    sylvaner: { type: [String], required: false },
    white_bordeaux: { type: [String], required: false }
  },

  red_wine: {
    dry_red_wine: {
      type: [String],
      required: false,
      default: [
        'merlot', 'pinot_noir', 'petite_sirah', 'zweigelt', 'baco_noir', 'bonarda', 'cabernet_franc',
        'bairrada', 'barbera_wine', 'primitivo', 'nebbiolo', 'dolcetto', 'tannat', 'negroamaro',
        'red_burgundy', 'corvina', 'rioja', 'cotes_du_rhone', 'grenache', 'malbec', 'zinfandel',
        'sangiovese', 'carignan', 'carmenere', 'cesanese', 'cabernet_sauvignon', 'aglianico',
        'tempranillo', 'shiraz', 'mourvedre', 'nero_d_avola'
      ]
    },
    bordeaux: { type: [String], required: false },
    marsala: { type: [String], required: false },
    port: { type: [String], required: false },
    agiorgitiko: { type: [String], required: false },
    concord_wine: { type: [String], required: false },
    dornfelder: { type: [String], required: false },
    gamay: { type: [String], required: false },
    pinotage: { type: [String], required: false },
    sparkling_red_wine: { type: [String], required: false }
  },

  dessert_wine: {
    type: [String],
    required: false,
    default: [
      'moscato', 'ice_wine', 'pedro_ximenez', 'late_harvest', 'white_port', 'lambrusco_dolce',
      'madeira', 'banyuls', 'vin_santo', 'port'
    ]
  },

  rose_wine: {
    type: [String],
    required: false,
    default: ['sparkling_rose']
  },

  sparkling_wine: {
    type: [String],
    required: false,
    default: ['cava', 'prosecco', 'cremant', 'champagne', 'spumante', 'sparkling_rose']
  },

  sherry: {
    type: [String],
    required: false,
    default: ['cream_sherry', 'dry_sherry']
  },

  vermouth: {
    type: [String],
    required: false,
    default: ['dry_vermouth']
  },

  fruit_wine: {
    type: [String],
    required: false,
    default: ['mead']
  }
});

module.exports = mongoose.model('Wine', wineSchema);
