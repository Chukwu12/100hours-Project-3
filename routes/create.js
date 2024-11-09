const express = require('express');
<<<<<<< HEAD
const router = express.Router();
// const multer = require('multer');
const createController = require('../controllers/create');
const { foodFacts } = require('../controllers/create');
=======
 const router = express.Router();
 const upload = require('../middleware/multer')
const createController = require("../controllers/create");

>>>>>>> f4e82b1734431d02f1fae1ba1b9df3f0cdd4cc17
// Route for rendering the create recipes page
router.get('/createRecipes', (req, res) => {
    res.render('createRecipes'); // Ensure this points to the correct EJS file
});

// Route to rending food triva
router.get('/createRecipes', createController.foodFacts);
router.get('/foodFact', foodFacts);

 //Enables user to create post w/ cloudinary for media uploads
 router.post("/createRecipes", upload.single("file"), createController.createRecipe);

module.exports = router;
