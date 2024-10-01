const Recipe = require("../models/Recipe");
const Favorite = require("../models/Favorite"); 
const cloudinary = require("../middleware/cloudinary");


const getProfile = async (req, res) => { 
    console.log(req.user)
    try {
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).render("login", { error: "Please log in to access your profile." });
    }
     // Grabbing just the recipes of the logged-in user
      const recipes = await Recipe.find({ user: req.user.id });

      console.log('Session:', req.session);
      console.log('User:', req.user);  

      //Sending post data from mongodb and user data to ejs template
      res.render("profile.ejs", { recipes: recipes, user: req.user });
    } catch (err) {
      console.error('Error fetching profile:', err);
        res.status(500).render("error", { error: "An error occurred while fetching your profile." });
    }
  }

  
      const likeRecipe = async (req, res) => {
        try {
            const recipe = await Recipe.findById(req.params.id);
            
            if (!recipe) {
                return res.status(404).send('Recipe not found'); // Handle not found case
            }
    
            await Recipe.findByIdAndUpdate(req.params.id, 
              { $inc: { likes: 1 } });
                console.log("Likes +1");
         // Redirect to the profile page with updated recipe data
          res.redirect(`/profile?recipeId=${req.params.id}`);
    } catch (err) {
        console.error('Error liking recipe:', err);
        res.status(500).send('Error liking recipe');
    }
};
    

      

      const deleteRecipe = async (req, res) => {
        try {
          const recipe = await Recipe.findById(req.params.id);
          if (!recipe) {
              return res.status(404).send('Recipe not found');
          }
          // Delete image from cloudinary
          await cloudinary.uploader.destroy(recipe.cloudinaryId);
          // Delete post from db
          await Recipe.findByIdAndDelete(req.params.id);
          console.log("Deleted Recipe");
          res.redirect("/profile");
        } catch (err) {
            console.error('Error deleting recipe:', err);
            res.status(500).send('Error deleting recipe');
        }
    };
    

   const getFavorites = async (req, res) => { 
        console.log(req.user)
        try {
          //Since we have a session each request (req) contains the logged-in users info: req.user
          //console.log(req.user) to see everything
          //Grabbing just the posts of the logged-in user
          const recipes = await Favorite.find({ user: req.user.id }).populate('recipe');
    
          res.render("profile.ejs", { recipes, user: req.user });
          //Sending post data from mongodb and user data to ejs template
        } catch (err) {
          console.error('Error fetching favorites:', err);
          res.status(500).send('Error fetching favorites');
      }
  };

     const favoriteRecipe = async (req, res) => {
        try {
          //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content 
          const existingFavorite = await Favorite.findOne({ user: req.user.id, recipe: req.params.id });
          if (existingFavorite) {
              return res.status(400).send('Recipe is already favorited');
          }
  
          await Favorite.create({ user: req.user.id, recipe: req.params.id });
          console.log("Favorite has been added!");
          res.redirect(`/profile?recipeId=${req.params.id}`);
      } catch (err) {
          console.error('Error adding favorite recipe:', err);
          res.status(500).send('Error adding favorite recipe');
      }
  };

      module.exports = {
        getProfile,
        favoriteRecipe,
        getFavorites,
        deleteRecipe,
        likeRecipe,
      }