

const createRecipe = async (req, res) => {
    try {
          // Validate spoonacularId
          if (!req.body.spoonacularId) {
            return res.status(400).json({ error: "spoonacularId is required." });
        }
        // Check if the recipe with the same spoonacularId already exists
        const existingRecipe = await Recipe.findOne({ spoonacularId: req.body.spoonacularId });
        if (existingRecipe) {
            return res.status(400).json({ error: "Recipe with this spoonacularId already exists." });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path).catch(err => {
            console.error("Cloudinary upload error:", err);
            return res.status(500).send('Error uploading image to Cloudinary');
        });
        
        // Create the recipe
        await Recipe.create({
            name: req.body.name,
            image: result.secure_url,
            cloudinaryId: result.public_id,
            ingredients: req.body.ingredients,
            directions: req.body.directions,
            likes: 0,
            spoonacularId: req.body.spoonacularId, // Make sure to include this field
            user: req.user.id,
        });

        console.log("Recipe has been added!");
        res.redirect("/create");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating recipe');
    }
};

const getCreateRecipePage = (req, res) => {
    res.render('createRecipes'); // Adjust according to your view engine and file name
};

module.exports = {
    createRecipe,
    getCreateRecipePage,
  }