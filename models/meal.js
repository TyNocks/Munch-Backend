const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Meal = new Schema({
    date: {type: Date},
    _uid: {type: String},
    recipes: [{type: Object}],
    CalPer: {type: Number},
    CalTotal: {type: Number}
},{collection: "Meals"})

const Meal = {
    date: new Date(),
    _uid: '',
    recipes: [],
    
}

module.exports = mongoose.model('Meal', Meal);