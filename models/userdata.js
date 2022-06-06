const crypto = require('crypto');


const UserData =  {

  email: '',
  _uid: '',
  hash: '',
  salt: '',
  mealData: {},

  setPassword: function(password) {
      UserData.salt = crypto.randomBytes(16).toString('hex');
      UserData.hash = crypto.pbkdf2Sync(password, UserData.salt, 1000, 64, 'sha512').toString('hex');
      UserData._uid = crypto.randomBytes(16).toString('hex');
  },

  validPassword: function(password) {
    var hash = crypto.pbkdf2Sync(password, UserData.salt, 1000, 64, 'sha512').toString('hex'); 
    return UserData.hash === hash;
  },

  json: function() {
    return {
      email: UserData.email,
      _uid: UserData._uid,
      hash: UserData.hash,
      salt: UserData.salt,
      mealData: UserData.mealData
    }
  }

};

module.exports = UserData;