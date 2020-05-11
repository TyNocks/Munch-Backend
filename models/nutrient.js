const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Nutrient = new Schema({
    fdc_id: {type: String},
    nutrient_id: {type: String},
    amount: {type: String},
    id: {type: String}
},{collection: "Ingredients"})

module.exports = mongoose.model('Nutrient', Nutrient);