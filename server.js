// server.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
// const MongoStore = require('connect-mongo')(session);
const logger = require('morgan');
const connectDB = require('./config/database');
const homeRoutes = require('./routes/home');
const todoRoutes = require('./routes/todos');
const recipeRoutes = require('./routes/recipe');
const healthRoutes = require('./routes/health');
const cuisineRoutes = require('./routes/cuisine');
const recipeInfo = require('./routes/recipeInfo');
const recipeController = require('./controllers/cuisine');


require('dotenv').config({ path: './config/.env' });

// Passport config
require('./config/passport')(passport);

// Connect to database
//connectDB();


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
 app.use('/cuisine', cuisineRoutes); // Ensure this path corresponds to cuisine routes
 // Use the recipe routes
app.use(recipeRoutes);
 // Define your route
 app.get('/cuisine/:type', recipeController.getCuisineRecipes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log('Server is running, you better catch it!');
});
