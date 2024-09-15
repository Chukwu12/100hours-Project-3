const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const profileController = require('../controllers/profile');

//Enables user to create post w/ cloudinary for media uploads
router.post("/createRecipe", upload.single("file"), profileController.createRecipe);

module.exports = router;