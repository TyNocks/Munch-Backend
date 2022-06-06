const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Nutrient = new Schema({
    fdc_id: {type: String, index: true},
    nutrient_id: {type: Number},
    amount: {type: Number},
    id: {type: Number}
},{collection: "Nutrient_Cleaned"})

module.exports = mongoose.model('Nutrient', Nutrient);