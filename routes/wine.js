const express = require('express');
const router = express.Router();
const { getRandomWineData } = require('../controllers/wine');

router.get('/random-wine-pairing', getRandomWineData);

module.exports = router;
