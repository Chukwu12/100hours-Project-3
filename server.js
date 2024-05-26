const express = require('express')
const app = express()
// const connectDB = require('./config/database')
const homeRoutes = require('./routes/home')
const todoRoutes = require('./routes/todos')

// require('dotenv').config({path: './config/.env'})

// connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', homeRoutes)
app.use('/todos', todoRoutes)

const PORT = process.env.PORT || 3000; // Use the port from the environment variables or default to 3000
 
app.listen(PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    