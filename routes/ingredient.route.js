const express = require("express");
const app = express();
const ingredientRoutes = express.Router();
const cors = require("cors");
let Ingredient = require("../models/ingredient");
let Nutrient = require("../models/nutrient");

const allowedOrigins = [
  "capacitor://localhost",
  "ionic://localhost",
  "http://localhost",
  "http://localhost:8080",
  "http://localhost:8100",
];

// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      //callback(new Error('Origin not allowed by CORS'));
      callback(null, true);
    }
  },
};
ingredientRoutes.all("*", cors(corsOptions));

ingredientRoutes.route("/search").post((req, res) => {
  let regex = req.body.search.map((x) => new RegExp(x, "i"));
  Ingredient.aggregate([
    { $match: { $text: { $search: req.body.search.join(" ") } } },
    {
      $project: {
        fdc_id: 1,
        description: 1,
        brand_owner: 1,
        serving_size: 1,
        serving_size_unit: 1,
        score: { $meta: "textScore" },
      },
    },
    { $sort: { description: 1 } },
    { $sort: { score: { $meta: "textScore" } } }, 
    { $limit: 30 },
  ])
    .then((ingredients) => {
      Ingredient.populate(ingredients, { path: 'nutrients', match: { nutrient_id: 1008 } }, (err, results) => res.status(200).send(results));
    })
    .catch((error) => res.status(500).send(error));
});

ingredientRoutes.route("/detailOne").post((req, res) => {
  Ingredient.findOne({ fdc_id: req.body.id })
    .populate({
      path: 'nutrients',
      match: { nutrient_id: { $in: [1003, 1004, 1005, 1008] } }
    })
    .then(ingredient => res.status(200).send(ingredient))
    .catch((error) => res.status(500).send(error))
});

ingredientRoutes.route("/detailMany").post((req, res) => {
  Ingredient.find({fdc_id: {$in: req.body.ids}})
  .populate({
    path: 'nutrients',
    match: { nutrient_id: { $in: [1003, 1004, 1005, 1008] } }
  })
  .then(ingredient => res.status(200).send(ingredient))
  .catch((error) => res.status(500).send(error))
})



module.exports = ingredientRoutes;
