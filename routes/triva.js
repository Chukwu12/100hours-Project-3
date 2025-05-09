 const express = require('express');
 const router = express.Router();
 const trivaController = require('../controllers/triva');

 // // Define your triva routes
 router.get('/random', trivaController.randomTriva); // Route to get random triva 
 

 module.exports = router;