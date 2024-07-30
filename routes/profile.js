const express = require("express");
const router = express.Router();
const profileController = require('../controllers/profile');

//Enables user to create post w/ cloudinary for media uploads
router.post("/createRecipe", upload.single("file"), recipesController.createRecipe);

module.exports = router;