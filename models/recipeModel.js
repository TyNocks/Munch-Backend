const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RecipeSchema = new Schema({
    uid: { type: Schema.Types.ObjectId, ref: 'User' },
    created: { type: Date },
    modified: { type: Date },
    ingredients: [{ ingredient: { type: Schema.Types.ObjectId, ref: 'Ingredient' }, amount: { type: Number } }],
    steps: [{type: String}]
},
{
    collection: 'Recipes'
}
);

const Recipe = mongoose.model('Recipe', RecipeSchema);
module.exports = Recipe;