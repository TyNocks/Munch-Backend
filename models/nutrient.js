const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Nutrient = new Schema({
    fdc_id: {type: Number, index: true},
    nutrient_id: {type: Number},
    amount: {type: Number},
    id: {type: Number}
},{collection: "Nutrients"})

module.exports = mongoose.model('Nutrient', Nutrient);