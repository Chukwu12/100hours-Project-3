const express = require('express');
 const router = express.Router();
 const upload = require('../middleware/multer')
const createController = require("../controllers/create");

// Route for rendering the create recipes page
router.get('/createRecipes', (req, res) => {
    res.render('createRecipes'); // Ensure this points to the correct EJS file
});

// Route to rending food triva
// router.get('/createRecipes', createController.foodFacts);
// router.get('/foodFact', foodFacts);

 //Enables user to create post w/ cloudinary for media uploads
 router.post("/createRecipes", upload.single("file"), createController.createRecipe);

module.exports = router;
