// server.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
 const MongoStore = require("connect-mongo");
const logger = require('morgan');
const methodOverride = require("method-override");
const connectDB = require('./config/database');
const path = require('path');
const multer = require('multer');

// Import routes
const homeRoutes = require('./routes/home');
const recipeRoutes = require('./routes/recipe');
const healthRoutes = require('./routes/health');
const dessertRoutes = require('./routes/dessert');
const recipeInfoRoutes = require('./routes/recipeInfo');
const mainRoutes = require('./routes/main');
 const profileRoutes = require('./routes/profile');
const cuisineRoutes = require('./routes/cuisine');

// Import controllers
const cuisineController = require('./controllers/cuisine');
const dessertController = require('./controllers/dessert');
const healthyController = require('./controllers/health');
 const recipeInfoController = require('./controllers/recipeInfo');
const recipeController = require('./controllers/recipe');
// const mainController = require('./controllers/main');
// const authController = require("../controllers/auth");
//const profileController = require('./controllers/profile');



// Load environment variables
require('dotenv').config({ path: './config/.env' });

// Passport config
require('./config/passport')(passport);

// Connect to database
connectDB();


//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));




// Middleware
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public')); // Serve static files
app.use(session({ secret: 'yourSecret', resave: false, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))
app.use(methodOverride("_method")); //Use forms for put / delete



// Sessions
app.use(
  session({
    secret: 'keyboard cat', // Change this to a more secure and unique secret in production
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_STRING, // Use environment variable for MongoDB URI
      collectionName: 'sessions' // Optional: Define the collection name for storing sessions
    })
  })
);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use('/', homeRoutes);
app.use('/recipe', recipeRoutes); // Ensure this path corresponds to recipe routes
app.use('/', recipeRoutes);
app.use('/dessert', dessertRoutes);
app.use('/health', healthRoutes);
app.use('/recipeInfo', recipeInfoRoutes);
 app.use('/cuisine', cuisineRoutes); // Ensure this path corresponds to cuisine routes
 app.use('/', mainRoutes);
 app.use('/createRecipe', profileRoutes);


 // Define your route directly if necessary
app.get('/cuisine/:type', cuisineController.getCuisineRecipes);
app.get('/dessert', dessertController.getDessertRecipes);
app.get('/health', healthyController.getHealthyDetails);
app.get('/recipe/:id', recipeController.getRecipeDetails);
app.get('/recipeInfo', recipeInfoController.getRecipeDetails);
app.get('/create-recipes', healthyController.getHealthRecipes);
app.get('/auth,authController.')




// Global error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


  const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log('Server is running, you better catch it!');
});
