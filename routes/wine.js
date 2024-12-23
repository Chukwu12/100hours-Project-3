 const express = require('express');
 const router = express.Router();
 const wineController = require('../controllers/wine');

// // Define your wine routes
router.get('/random', wineController.getChardonnayWine);  // Route to get random wine



 module.exports = router;