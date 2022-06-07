const express = require("express");
const recipeRoutes = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;
const cors = require("cors");
const config = require('../config');


recipeRoutes.all("*", cors(config.corsOptions));

//
// Add recipe route
//
recipeRoutes.route("/add").post((req, res) => {
  
});

//
// Edit recipe route
//
recipeRoutes.route("/edit").post((req, res) => {
  
});

//
// Delete recipe route
//
recipeRoutes.route("/delete").post((req, res) => {
  
});

//
// Get one detail
//
recipeRoutes.route("/detail").post((req, res) => {
  
});

//
//Recipe search
//
recipeRoutes.route("/search").post((req, res) => {
  
});

//
//Initial list
//
recipeRoutes.route("/list").post(function (req, res) {
  
});

module.exports = recipeRoutes;
