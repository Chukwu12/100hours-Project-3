const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const flash = require('express-flash')
const MongoStore = require('connect-mongo'); 
const logger = require('morgan')
 const connectDB = require('./config/database')
const homeRoutes = require('./routes/home')
const todoRoutes = require('./routes/todos')
const recipeRoutes = require('./routes/recipe') // Corrected path to the recipe route

 require('dotenv').config({path: './config/.env'})

 // Passport config
require('./config/passport')(passport)


// Import connectDB from your database.js file
const connectDB = require('./config/database'); // Adjust the path as needed



// Middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))

// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
     store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)


// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use('/', homeRoutes)
app.use('/todos', todoRoutes)
app.use('/recipe', recipeRoutes) // Use the correct route for recipes



const PORT = process.env.PORT || 3000; // Use the port from the environment variables or default to 3000

app.listen(PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    