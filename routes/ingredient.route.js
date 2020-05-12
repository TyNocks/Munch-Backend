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


ingredientRoutes.all("*", cors(corsOptions));

ingredientRoutes.route('/search').post((req, res) => {
    let regex = req.body.search.map(x => new RegExp(x, 'i'));
    IngredientSearch.find({}, { fdc_id: 1, description: 1, _id: 0 }).limit(10000)
        .then(ingredients => {
            let counter = 0;
            ingredients.forEach(ingredient => {
                Ingredient.findOneAndUpdate({ 'fdc_id': ingredient['fdc_id'] }, { description: ingredient.description }).then(x => {
                    IngredientSearch.findOneAndDelete({fdc_id: ingredient.fdc_id}).then(y => {
                    counter += 1;
                    if (counter % 20 == 0) { console.log(counter) }
                    })
                });
            });
            console.log('done');
            res.status(200).send();
        })
        .catch(error => res.status(500).send(error))
});

module.exports = ingredientRoutes;