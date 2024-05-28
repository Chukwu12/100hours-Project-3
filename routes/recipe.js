const express = require('express')
const router = express.Router()


// router.get('/', homeController.getIndex) 

router.get('/', (req, res) => {
    res.render('recipe') // Render the recipe.ejs file
})

module.exports = router