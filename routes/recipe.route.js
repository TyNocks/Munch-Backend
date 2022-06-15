const express = require("express");
const recipeRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const config = require('../config');
const tokenAuth = require('../middleware')


recipeRoutes.all("*", cors(config.corsOptions));
recipeRoutes.use('/add', tokenAuth.tokenAuth);
recipeRoutes.use('/edit', tokenAuth.tokenAuth);
recipeRoutes.use('/delete', tokenAuth.tokenAuth);

//
// Add recipe route
//
recipeRoutes.route("/add").post((req, res) => {
  switch (req.body?.recipe) {
    case undefined:
      res.status(205).send({ message: 'No recipe data sent.' });
      break;
    default:
      req.app.locals.db.db('Food').collection('Recipes')
        .insertOne(req.body.recipe)
        .then(x => res.status(200).send(x));
      break;
  }
});

//
// Edit recipe route
//
recipeRoutes.route("/edit").post((req, res) => {
  switch (req.body?.recipe) {
    case undefined:
      res.status(205).send({ message: 'No recipe data sent.' });
      break;
    default:
      req.app.locals.db.db('Food').collection('Recipes')
        .replaceOne({_id: new ObjectId(req.body.recipe._id)}, req.body.recipe)
        .then(x => res.status(200).send(x));
      break;
  }
});

//
// Delete recipe route
//
recipeRoutes.route("/delete").post((req, res) => {
  switch (req.body?.recipe) {
    case undefined:
      res.status(205).send({ message: 'No recipe data sent.' });
      break;
    default:
      req.app.locals.db.db('Food').collection('Recipes')
        .deleteOne({_id: req.body.recipe._id})
        .then(x => res.status(200).send(x));
      break;
  }
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
