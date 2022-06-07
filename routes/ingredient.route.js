const express = require("express");
const ingredientRoutes = express.Router();
const cors = require("cors");
const config = require('../config')


ingredientRoutes.all("*", cors(config.corsOptions));

//
//Ingredient search. Will always need improvement.
//

ingredientRoutes.route("/search").post((req, res) => {
  let search = req.body?.search
  switch (search) {
    case undefined:
      res.status(205).send({ 'error': 'No search terms.' });
      break;
    default:
      req.app.locals.db.db('Food').collection('Branded')
        .aggregate([
          { '$match': { '$text': { '$search': req.body.search } } },
          { '$sort': { 'score': { '$meta': 'textScore' } } },
          { '$limit': req.body.limit || 20 },
          { '$project': { 'ingredients': 0 } }
        ])
        .toArray()
        .then(results => res.status(200).send(results))
        .catch(err => {
          console.log(err);
          res.status(500).send({ error: err });
        });
      break;
  }
});

//
// Get names and ids for search hints.
//

ingredientRoutes.route("/hint").post((req, res) => {
  switch (req.body?.search) {
    case undefined:
      res.status(205).send({ 'error': 'No search terms.' });
      break;
    default:
      req.app.locals.db.db('Food').collection('Branded')
        .aggregate([
          { '$match': { '$text': { '$search': req.body.search } } },
          { '$sort': { 'score': { '$meta': 'textScore' } } },
          { '$limit': 5 },
          { '$project': { brand_name: 1, fdc_id: 1, _id: 0 } }
        ])
        .toArray()
        .then(results => res.status(200).send(results))
        .catch(err => {
          console.log(err);
          res.status(500).send({ error: err });
        });
      break;
  }
});

//
// Get nutrient details.
//

ingredientRoutes.route('/nutrient').post(function (req, res) {
  search_type = typeof(req.body?.fdc_id);
  switch (search_type) {
    case undefined:
      res.status(205).send({ 'error': 'No id.' });
      break;
    //
    // Single id sent as a string.
    case "string":
      req.app.locals.db.db('Food').collection('Nutrient_Cleaned')
        .findOne({ fdc_id: req.body.fdc_id })
        .then(results => res.status(200).send(results))
        .catch(err => {
          console.log(err);
          res.status(500).send({ error: err });
        });
      break;
    //
    // Array of ids.
    default:
      req.app.locals.db.db('Food').collection('Nutrient_Cleaned')
        .find({ fdc_id: {'$in': req.body.fdc_id} })
        .toArray()
        .then(results => res.status(200).send(results))
        .catch(err => {
          console.log(err);
          res.status(500).send({ error: err });
        });
      break;
  }
});

//
// Get nutrient details for list of foods.
//

ingredientRoutes.route('/nutrientMany').post(function (req, res) {
  switch (req.body?.fdc_id) {
    case undefined:
      res.status(205).send({ 'error': 'No id.' });
      break;
    default:
      req.app.locals.db.db('Food').collection('Nutrient_Cleaned')
        .find({ fdc_id: {'$in': req.body.fdc_id} })
        .toArray()
        .then(results => res.status(200).send(results))
        .catch(err => {
          console.log(err);
          res.status(500).send({ error: err });
        });
      break;
  }
});

module.exports = ingredientRoutes;
