// server.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
// const MongoStore = require('connect-mongo')(session);
const logger = require('morgan');
const methodOverride = require("method-override");
const connectDB = require('./config/database');
const homeRoutes = require('./routes/home');
const todoRoutes = require('./routes/todos');
const recipeRoutes = require('./routes/recipe');
const healthRoutes = require('./routes/health');
// const profileRoutes = require('./routes/profile');
const cuisineRoutes = require('./routes/cuisine');
const dessertRoutes = require('./routes/dessert');
const recipeInfoRoutes = require('./routes/recipeInfo');
const recipeController = require('./controllers/cuisine');
const dessertController = require('./controllers/dessert');
const healthController = require('./controllers/health');
// const profileController = require('./controllers/profile');



require('dotenv').config({ path: './config/.env' });

// Passport config
require('./config/passport')(passport);

// Connect to database
//connectDB();

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Middleware
app.set('view engine', 'ejs')
app.set('views', './views');
// app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))
// Serve static files like images




// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    //  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use('/', homeRoutes);
app.use('/todos', todoRoutes);
app.use('/recipe', recipeRoutes); // Ensure this path corresponds to recipe routes
app.use('/health', healthRoutes);
app.use('/recipeInfo', recipeInfoRoutes);
 app.use('/cuisine', cuisineRoutes); // Ensure this path corresponds to cuisine routes
 app.use('/dessert', dessertRoutes);
 app.use('/', recipeInfoRoutes);
//  app.use('/profile', profileRoutes);



 // Define your route
app.get('/cuisine/:type', recipeController.getCuisineRecipes);
app.get('/dessert', dessertController.getDessertRecipes);
app.get('/health', healthController.getHealthRecipes);
// app.get('/profile', profileController.createRecipes);
 
 // Route to get recipe details and render it
app.get('/recipeInfo/:recipeId', async (req, res) => {
  try {
      const recipeId = req.params.recipeId;
      const response = await axios.get(`${RECIPE_DETAILS_API_URL}/${recipeId}/information`, {
          params: {
              apiKey: RECIPES_API_KEY
          }
      });

      const recipeDetails = response.data;
      res.render('recipeInfo', { recipe: recipeDetails }); // Render the EJS template with recipe details
  } catch (error) {
      console.error('Error fetching recipe details from Spoonacular:', error.message);
      res.status(500).send('Server Error');
  }
});




 const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log('Server is running, you better catch it!');
});
