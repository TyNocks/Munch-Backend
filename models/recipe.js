const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Product
let Recipe = new Schema({
  _uid: {type: String},
  Title: {type: String},
  Ingredients: [{type: Object}],
  Directions: [{type: String}],
  CookTime: {type: Number, default: 0},
  PrepTime: {type: Number, default: 0},
  CalPer: {type: Number, default: 0},
  CalTotal: {type: Number, default: 0},
  Servings: {type: Number, default: 1},
  url: {type: String, default: ''},
  ratings: {type: Object, default: {base: 0}},
  tags: {type: String}
},{
    collection: 'Recipes'
});

module.exports = mongoose.model('Recipe', Recipe);
