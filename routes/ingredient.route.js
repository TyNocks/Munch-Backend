const express = require("express");
const app = express();
const ingredientRoutes = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;
const cors = require("cors");
let Ingredient = require('../models/ingredient');
let IngredientSearch = require('../models/ingredientsearch')
let Nutrient = require('../models/nutrient');

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

const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: item,
        };
    }, initialValue);
};

const sorting = function (x, y) {
    let a = regex.map(reg => reg.test(x) ? 1 : 0).reduce((acc, cur) => acc + cur);
    let b = regex.map(reg => reg.test(y) ? 1 : 0).reduce((acc, cur) => acc + cur);
    return b - a;
}


ingredientRoutes.all("*", cors(corsOptions));

ingredientRoutes.route('/search').post((req, res) => {
    let regex = req.body.search.map(x => new RegExp(x, 'i'));
    IngredientSearch.find({ description: { $in: regex } }, { fdc_id: 1, description: 1 })
        .then(ingredients => {
            Ingredient.find({ brand_owner: { $in: regex } }, { fdc_id: 1, brand_owner: 1 })
                .then(ingredientsLong => {
                    
                })
                .catch()
            res.status(200).send(ingredients);
        })
        .catch(error => res.status(500).send(error))
})