const cloudinary = require("../middleware/cloudinary");
const Recipe = require("../models/Recipe");
const Favorite = require("../models/Favorite"); 



// module.exports = {
//   getProfile: async (req, res) => { 
//     console.log(req.user)
//     try {
//       //Since we have a session each request (req) contains the logged-in users info: req.user
//       //console.log(req.user) to see everything
//       //Grabbing just the posts of the logged-in user
//       const recipes = await Recipe.find({ user: req.user.id });
//       //Sending post data from mongodb and user data to ejs template
//       res.render("profile.ejs", { recipes: recipes, user: req.user });
//     } catch (err) {
//       console.log(err);
//     }
//   }};

  
//       const likeRecipe = async (req, res) => {
//         try {
//             const recipe = await Recipe.findById(req.params.id);
            
//             if (!recipe) {
//                 return res.status(404).send('Recipe not found'); // Handle not found case
//             }
    
//             await Recipe.findByIdAndUpdate(req.params.id, 
//               { $inc: { likes: 1 } });
//                 console.log("Likes +1");
//          // Redirect to the profile page with updated recipe data
//           res.redirect(`/profile?recipeId=${req.params.id}`);
//     } catch (err) {
//         console.error('Error liking recipe:', err);
//         res.status(500).send('Error liking recipe');
//     }
// };
    

      

//       const deleteRecipe = async (req, res) => {
//         try {
//           const recipe = await Recipe.findById(req.params.id);
//           if (!recipe) {
//               return res.status(404).send('Recipe not found');
//           }
//           // Delete image from cloudinary
//           await cloudinary.uploader.destroy(recipe.cloudinaryId);
//           // Delete post from db
//           await Recipe.findByIdAndDelete(req.params.id);
//           console.log("Deleted Recipe");
//           res.redirect("/profile");
//         } catch (err) {
//             console.error('Error deleting recipe:', err);
//             res.status(500).send('Error deleting recipe');
//         }
//     };
    

//    const getFavorites = async (req, res) => { 
//         console.log(req.user)
//         try {
//           //Since we have a session each request (req) contains the logged-in users info: req.user
//           //console.log(req.user) to see everything
//           //Grabbing just the posts of the logged-in user
//           const recipes = await Favorite.find({ user: req.user.id }).populate('recipe');
    
//           res.render("profile.ejs", { recipes, user: req.user });
//           //Sending post data from mongodb and user data to ejs template
//         } catch (err) {
//           console.error('Error fetching favorites:', err);
//           res.status(500).send('Error fetching favorites');
//       }
//   };

//      const favoriteRecipe = async (req, res) => {
//         try {
//           //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content 
//           const existingFavorite = await Favorite.findOne({ user: req.user.id, recipe: req.params.id });
//           if (existingFavorite) {
//               return res.status(400).send('Recipe is already favorited');
//           }
  
//           await Favorite.create({ user: req.user.id, recipe: req.params.id });
//           console.log("Favorite has been added!");
//           res.redirect(`/profile?recipeId=${req.params.id}`);
//       } catch (err) {
//           console.error('Error adding favorite recipe:', err);
//           res.status(500).send('Error adding favorite recipe');
//       }
//   };

//       module.exports = {
//         favoriteRecipe,
//         getFavorites,
//         deleteRecipe,
//         likeRecipe,
//       }

module.exports = {
  getProfile: async (req, res) => { 
    console.log(req.user)
    try {
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      const recipes = await Recipe.find({ user: req.user.id });
      //Sending post data from mongodb and user data to ejs template
      res.render("profile.ejs", { recipes: recipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFavorites: async (req, res) => { 
    console.log(req.user)
    try {
      // Fetching favorites and populating the associated recipe data
      const recipes = await Favorite.find({ user: req.user.id })
                                    .populate('recipe', 'name ingredients imageUrl')  // Limit fields if necessary
                                    .sort({ createdAt: -1 });  // Optional: Sort by most recent favorites
  
      // Check if the user has any favorites
      if (!recipes.length) {
        return res.render("profile.ejs", {
          // message: "You haven't favorited any recipes yet.",  // Optional: Message if no favorites
          user: req.user
        });
      }
  
      // Send the favorites to the profile page
      res.render("profile.ejs", { recipes, user: req.user });
  
    } catch (err) {
      console.log('Error fetching favorites:', err);
      // Optionally redirect to an error page or send an error message
      res.status(500).render("error.ejs", { message: "There was an error retrieving your favorites." });
    }
  },
  getRecipe: async (req, res) => {
    try {
      //id parameter comes from the post routes
      //router.get("/:id", ensureAuth, postsController.getPost);
      //http://localhost:2121/post/631a7f59a3e56acfc7da286f
      //id === 631a7f59a3e56acfc7da286f
      const recipe = await Recipe.findById(req.params.id);
      res.render("recipe.ejs", { recipe: recipe, user: req.user});
    } catch (err) {
      console.log(err);
    }
  },
  createRecipe: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content 
      await Recipe.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        ingredients: req.body.ingredients,
        directions: req.body.directions,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("profile.ejs");
    } catch (err) {
      console.log(err);
    }
  },
  favoriteRecipe: async (req, res) => {
    try {
      //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content 
      await Favorite.create({
        user: req.user.id,
        recipe: req.params.id,
      });
      console.log("Favorite has been added!");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  likeRecipe: async (req, res) => {
    try {
      await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteRecipe: async (req, res) => {
    try {
      // Find post by id
      let recipe = await Recipe.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(recipe.cloudinaryId);
      // Delete post from db
      await Recipe.remove({ _id: req.params.id });
      console.log("Deleted Recipe");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },

   getUserProfile: async (req, res) => {
    try {
      const userId = req.user._id; // Get the logged-in user's ID
  
      // Find all favorite recipes for the user
      const favorites = await Favorite.find({ user: userId })
        .populate('recipe')  // Populate the `recipe` field to get full recipe details
        .exec();
  
      if (!favorites) {
        return res.status(404).json({ message: 'No favorite recipes found' });
      }
  
      // Extract recipe details
      const favoriteRecipes = favorites.map(favorite => favorite.recipe);
  
      // Return the user's profile data, including their favorite recipes
      res.status(200).json({
        message: 'User profile fetched successfully',
        profile: {
          name: req.user.name,  // Assuming `req.user` contains user details
          email: req.user.email,
          favorites: favoriteRecipes,  // Array of favorite recipes
        },
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

