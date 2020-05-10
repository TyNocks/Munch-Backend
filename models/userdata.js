const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var crypto = require('crypto');


// Define collection and schema for Product
let UserData = new Schema({
  email: {type: String, required: true},
  _uid: {type: String},
  hash: {type: String},
  salt: {type: String},
  mealData: {type: Object, default: {register: '1'}}
},{
    collection: 'UserData'
});

UserData.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  this._uid = crypto.randomBytes(16).toString('hex');
}

UserData.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex'); 
  return this.hash === hash;
}

module.exports = mongoose.model('UserData', UserData);