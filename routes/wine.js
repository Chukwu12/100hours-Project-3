const express = require('express');
const router = express.Router();
const wineController = require('../controllers/wine');

// Define the route for fetching random wine pairing and description
  router.get('/', wineController.getWinePairingAndDescription);

 module.exports = router;