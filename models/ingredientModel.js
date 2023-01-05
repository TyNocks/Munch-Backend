const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//
// Ingredient schema
//

let IngredientSchema = new Schema({
    fdc_id: { type: String, index: true },
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
        collection: "Food",
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Fill nutrients from nutrient collection

IngredientSchema.virtual('nutrients', {
    ref: 'Nutrient',
    localField: 'fdc_id',
    foreignField: 'fdc_id',
    justOne: false
})

//
// Nutrient schema
//

let NutrientSchema = new Schema(
    {
        fdc_id: { type: String, index: true },
        nutrient_id: { type: String },
        amount: { type: Number },
        name: { type: String }
    },
    {
        collection: "Nutrient",
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

NutrientSchema.virtual('nutrient_name', {
    ref: 'nDef',
    localField: 'nutrient_id',
    foreignField: 'nutrient_nbr',
})

//
// Nutrient def schema
//

let nDefSchema = new Schema(
    {
        id: { type: String },
        name: { type: String },
        unit_name: { type: String },
        nutrient_nbr: { type: String },
        rank: { type: String }
    },
    {
        collection: 'nDef'
    }
);

const nDef = mongoose.model('nDef', nDefSchema);
const Nutrient = mongoose.model('Nutrient', NutrientSchema);
const Ingredient = mongoose.model('Ingredient', IngredientSchema);
module.exports = { Ingredient, Nutrient };