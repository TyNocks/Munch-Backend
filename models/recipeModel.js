const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RecipeSchema = new Schema({
    uid: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    created: { type: Date },
    modified: { type: Date },
    ingredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }],
    amounts: [{type: Number}],
    steps: [{type: String}],
    favorites: {type: Number , default: 0},
    keywords: {type: String},
    servings: {type: Number, default: 1},
    sourceURL: {type: String}
},
{
    collection: 'Recipes'
}
);

const Recipe = mongoose.model('Recipe', RecipeSchema);
module.exports = Recipe;