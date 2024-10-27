 const API_FOOD_TRIVA = 'https://api.spoonacular.com/food/trivia/random';
  const RECIPES_API_KEY = process.env.RECIPES_API_KEY;

const foodFacts = async (req, res) => {
    try {
        if (!RECIPES_API_KEY) {
            throw new Error('API key is missing');
        }

        const response = await axios.get(API_FOOD_TRIVA, {
            params: {
                apiKey: RECIPES_API_KEY,
    
            }
        });

         // Check for a valid response
         if (!response || !response.data) {
            return res.status(500).json({ message: 'Invalid API response' });
        }

        const trivia = response.data.text;
         // Render or return the trivia as needed
         res.render('createRecipes', { trivia });
        
        } catch (error) {
            console.error('Error fetching food trivia:', error);
            res.status(500).json({ message: 'An error occurred while fetching food trivia.' });
        }
    };


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
     foodFacts,
  }