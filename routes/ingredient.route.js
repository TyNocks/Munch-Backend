const express = require("express");
const ingredientRoutes = express.Router();
const cors = require("cors");
const config = require('../config')


ingredientRoutes.all("*", cors(config.corsOptions));

ingredientRoutes.route("/search").post((req, res) => {

  foodDB = req.app.locals.db.db('Food').collection('Food');
  nutrientDB = req.app.locals.db.db('Food').collection('Nutrient_Cleaned');

  switch (req.body == undefined) {
    case undefined:
      res.status(205).send({ 'error': 'No meal data.' });
      break;
    default:
      req.app.locals.db.db('Food').collection('Food')
        .find({ '$text': { '$search': req.body.search } }, { 'score': { '$meta': 'textScore' } })
        .sort({ 'score': { '$meta': 'textScore' } })
        .limit(req.body.limit || 10)
        .toArray()
        .then(results => {
          fdc_ids = results.map(x => x.fdc_id);
          req.app.locals.db.db('Food').collection('Nutrient_Cleaned')
            .find({ fdc_id: { '$in': fdc_ids } })
            .then(nutrients => {
              res.status(200).send({ foods: results, nutrients: nutrients });
            });
        })
        .catch(err => {
          console.log(err);
          res.status(500).send({ error: err });
        });
      break;
  }
});

ingredientRoutes.route("/detailOne").post((req, res) => {
  Ingredient.findOne({ fdc_id: req.body.id })
    .populate({
      path: "nutrients",
      match: { nutrient_id: { $in: [1003, 1004, 1005, 1008] } },
    })
    .then((ingredient) => res.status(200).send(ingredient))
    .catch((error) => res.status(500).send(error));
});

ingredientRoutes.route("/detailMany").post((req, res) => {
  Ingredient.find({ fdc_id: { $in: req.body.ids } })
    .populate({
      path: "nutrients",
      match: { nutrient_id: { $in: [1003, 1004, 1005, 1008] } },
    })
    .then((ingredient) => res.status(200).send(ingredient))
    .catch((error) => res.status(500).send(error));
});

module.exports = ingredientRoutes;
