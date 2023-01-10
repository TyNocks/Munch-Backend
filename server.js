//
//  Imports
//
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');
const recipeRoute = require('./routes/recipeRoute');
const ingredientRoute = require('./routes/ingredientRoute');
const DB = require('./db')



//
//  Database connection.
//
mongoose.connect(DB.uri);
const database = mongoose.connection;
database.on('error', (error) => { console.log(error) } );
database.once('connected', () => { console.log('Database Connected') } );


//
// server setup
//
const app = express();
const port = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', userRoute);
app.use('/recipe', recipeRoute);
app.use('/ingredient', ingredientRoute)

app.listen(port, () => {
    console.log(`Server Started at ${3000}`)
})