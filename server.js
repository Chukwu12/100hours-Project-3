// server.js
const express = require('express');
const app = express();
const mongoose = require('mongoose'); 
const passport = require('passport');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const flash = require('express-flash');
const logger = require('morgan');
const connectDB = require('./config/database');
const methodOverride = require("method-override");

const path = require('path');
  

// Import routes
const homeRoutes = require('./routes/home');
const recipeRoutes = require('./routes/recipe');
const healthRoutes = require('./routes/health');
const dessertRoutes = require('./routes/dessert');
const recipeInfoRoutes = require('./routes/recipeInfo');
const mainRoutes = require('./routes/main');
const profileRoutes = require('./routes/profile');
const cuisineRoutes = require('./routes/cuisine');
// const createRoutes = require('./routes/create');
const wineRoutes = require('./routes/wine');
const trivaRoutes = require('./routes/triva');


// Import controllers
 const cuisineController = require('./controllers/cuisine');
 const dessertController = require('./controllers/dessert');
 const healthyController = require('./controllers/health');
 const recipeInfoController = require('./controllers/recipeInfo');
 const recipeController = require('./controllers/recipe');
 const mainController = require('./controllers/main');
 const authController = require('./controllers/auth'); 
 const profileController = require('./controllers/profile');
 const createController = require('./controllers/create');


// Load environment variables
require('dotenv').config({ path: './config/.env' });

// Passport config
require("./config/passport")(passport);


// Connect to database
  connectDB();

// Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging
  app.use(logger("dev")); 

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET, // used to sign the session ID cookie
    resave: false, // forces session to be saved back to the session store
    saveUninitialized: false, // saves a new session, even if uninitialized
    store: MongoStore.create({
      mongoUrl: process.env.DB_STRING,  // Use environment variable for MongoDB URI
      // collectionName: 'sessions' // Optional: Define the collection name for storing sessions
    })
  })
);


// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public')); // Serve static files
app.use(express.urlencoded({ extended: true }))
 app.use(express.json())
 app.use(logger('dev'))
 app.use(methodOverride("_method")); // Comment out if not needed

// Passport middleware
    app.use(passport.initialize());
     app.use(passport.session());

// Use flash messages for errors, info, etc...
      app.use(flash());

// Setup Routes For Which The Server Is Listening
app.use('/', homeRoutes);
app.use('/', recipeRoutes);
  app.use('/recipe', recipeRoutes);
 app.use('/dessert', dessertRoutes);
 app.use('/health', healthRoutes);
  app.use('/recipeInfo', recipeInfoRoutes);
  app.use('/cuisine', cuisineRoutes);
  app.use('/', mainRoutes);
 app.use('/profile', profileRoutes);
//  app.use('/', createRoutes);
  //  app.use('/wines', wineRoutes);
  //  app.use('/triva', trivaRoutes);

  // Define your route directly if necessary
// app.get('/cuisine/:type', cuisineController.getCuisineRecipes);
// app.get('/dessert', dessertController.getDessertRecipes);
// app.get('/dessert', dessertController.getRecipeDetails )
// app.get('/health', healthyController.getHealthyDetails);
// app.use('recipe', recipeController.getRandomRecipes);
// app.get('/recipe/:id', recipeInfoController.getRecipeDetails);
// app.get('/recipeInfo', recipeInfoController.getRecipeDetails);
// app.get('/createRecipes', createController.createRecipe);
//  app.get('/login', authController.getLogin);
// app.get('/profile', profileController.getProfile);
// app.get('/', mainController.combinedData);  // For combined recipes and wine pairing
// app.get('/', recipeController.fetchFavorite);




// Global error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server is running, you better catch it!');
});
