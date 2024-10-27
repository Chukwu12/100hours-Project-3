// server.js
const express = require('express');
const app = express();
  // const mongoose = require('mongoose'); // Comment out if not needed
  // const passport = require('passport');
  // const session = require('express-session');
  // const flash = require('express-flash');
  //  const MongoStore = require("connect-mongo");
//  const logger = require('morgan');
 const methodOverride = require("method-override");
//  const connectDB = require('./config/database');
  const path = require('path');
//  const multer = require('./middleware/multer')

// Import routes
const homeRoutes = require('./routes/home');
  const recipeRoutes = require('./routes/recipe');
 const healthRoutes = require('./routes/health');
 const dessertRoutes = require('./routes/dessert');
 const recipeInfoRoutes = require('./routes/recipeInfo');
const mainRoutes = require('./routes/main');
 const profileRoutes = require('./routes/profile');
 const cuisineRoutes = require('./routes/cuisine');
 const createRoutes = require('./routes/create');

// Import controllers
//  const cuisineController = require('./controllers/cuisine');
//  const dessertController = require('./controllers/dessert');
//  const healthyController = require('./controllers/health');
//  const recipeInfoController = require('./controllers/recipeInfo');
//  const recipeController = require('./controllers/recipe');
//  const mainController = require('./controllers/main');
//  const authController = require('./controllers/auth'); 
//  const profileController = require('./controllers/profile');
//  const createController = require('./controllers/create');

// Load environment variables
require('dotenv').config({ path: './config/.env' });

// Connect to database
//  connectDB();

// Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging
//  app.use(logger("dev")); // Comment out if not needed

// Sessions
//  app.use(
//   session({
//     secret: 'SESSION_SECRET',
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.DB_STRING,
//       collectionName: 'sessions'
//     })
//   })
// );

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public')); // Serve static files
 app.use(methodOverride("_method")); // Comment out if not needed

// Passport middleware
  // app.use(passport.initialize());
  // app.use(passport.session());

// Use flash messages for errors, info, etc...
  //  app.use(flash());

// Setup Routes For Which The Server Is Listening
app.use('/', homeRoutes);

// Comment out all other routes
  app.use('/recipe', recipeRoutes);
 app.use('/', dessertRoutes);
 app.use('/dessert', dessertRoutes);
 app.use('/', healthRoutes);
 app.use('/health', healthRoutes);
   app.use('/', recipeRoutes);
  app.use('/recipe', recipeRoutes);

 app.use('/recipeInfo', recipeInfoRoutes);
 app.use('/cuisine', cuisineRoutes);
  app.use('/', mainRoutes);
 app.use('/dessert', dessertRoutes);
 app.use('/health', healthRoutes);
 app.use('/', profileRoutes);
 app.use('/', createRoutes);

 console.log('Routes registered:');
console.log('/home');
console.log('/dessert');
console.log('/health');
console.log('/recipe');




// Global error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server is running, you better catch it!');
});
