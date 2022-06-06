const express = require("express");
const app = express();
const recipeRoutes = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;
const cors = require("cors");
const config = require('../config');


recipeRoutes.all("*", cors(config.corsOptions));

// Require Product model in our routes module
let Recipe = require("../models/recipe");

// Add recipe route
recipeRoutes.route("/add").post((req, res) => {
  req.body._id = new ObjectId();
  Recipe(req.body)
    .save()
    .then((recipe) => {
      res.status(200).send({ _id: req.body._id });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Edit recipe route
recipeRoutes.route("/edit").post((req, res) => {
  Recipe.updateOne({ _id: new ObjectId(req.body._id) }, { $set: req.body })
    .then((recipe) => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// Delete recipe route
recipeRoutes.route("/delete").post((req, res) => {
  Recipe.findOneAndDelete(req.body)
    .then((recipe) => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// Get one detail
recipeRoutes.route("/detail").post((req, res) => {
  Recipe.findOne({_id: new ObjectId(req.body._id)})
    .then((recipe) => {
      res.status(200).json(recipe);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//Recipe search
recipeRoutes.route("/search").post((req, res) => {
  regex = req.body.search.map(x => new RegExp(x, 'i'));
  if (req.body.search[0] != '' ) {
  Recipe.find({'tags': {$all: regex}}, {Title: 1, CalPer: 1, Servings: 1})
    .then((recipes) => res.status(200).send(recipes))
    .catch((error) => res.status(500).send({ error: error }));
  } else {
    Recipe.find({})
    .then((recipes) => res.status(200).send(recipes))
    .catch((error) => res.status(500).send({ error: error }));
  }
});

//Initial list
recipeRoutes.route("/list").post(function (req, res) {
  Recipe.find({}, {Title: 1, CalPer: 1}).then((recipes) => {
    res.status(200).json(recipes);
  });
});

module.exports = recipeRoutes;
