const express = require('express');
const router = express.Router();
const trivaController = require('../controllers/trivia');

// // Define your triva routes
router.get('/random', trivaController.randomTriva); // Route to get random triva 


module.exports = router;