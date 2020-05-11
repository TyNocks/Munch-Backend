const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let IngredientSearch = new Schema({
    fdc_id: { type: String },
    description: { type: String }
},
    {collection: "IngredientSearch"}
);


module.exports = mongoose.model('IngredientSearch', IngredientSearch);