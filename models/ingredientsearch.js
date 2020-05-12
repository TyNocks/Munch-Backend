const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let IngredientSearch = new Schema({
    fdc_id: { type: String },
    description: { type: String }
},
    {
        collection: "IngredientSearch",
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

IngredientSearch.virtual('brand_owner', {
    ref: 'Ingredient',
    localField: 'fdc_id',
    foreignField: 'fdc_id',
    justOne: true,
    
})


module.exports = mongoose.model('IngredientSearch', IngredientSearch);