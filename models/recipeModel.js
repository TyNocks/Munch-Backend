const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RecipeSchema = new Schema({
    uid: { type: Schema.Types.ObjectId, ref: 'User' },
    created: { type: Date },
    modified: { type: Date },
    ingredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }],
    amounts: [{type: Number}],
    steps: [{type: String}]
},
{
    collection: 'Recipes'
}
);

const Recipe = mongoose.model('Recipe', RecipeSchema);
module.exports = Recipe;