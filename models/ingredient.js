const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Ingredient = new Schema({
    fdc_id: { type: Number, index: true },
    getin_upc: { type: String },
    brand_owner: { type: String },
    ingredients: { type: String },
    serving_size: { type: String },
    serving_size_unit: { type: String },
    household_serving_fulltext: { type: String },
    branded_food_category: { type: String },
    description: { type: String }
},
    {
        collection: "Ingredients",
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

Ingredient.virtual('nutrients', {
    ref: 'Nutrient',
    localField: 'fdc_id',
    foreignField: 'fdc_id',
    justOne: false
})

module.exports = mongoose.model('Ingredient', Ingredient);