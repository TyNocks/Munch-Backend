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
  Ingredient.find(
    {
      $or: [
        { description: { $all: regex } }
      ]
    },
    {
      fdc_id: 1,
      description: 1,
      brand_owner: 1,
      _id: 0
    }
  )
    .populate('Calories')
    .limit(30)
    .then((ingredients) => res.status(200).send(ingredients))
    .catch((error) => res.status(500).send(error));
});



module.exports = ingredientRoutes;
