const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},
    {
        collection: 'User'
    }
);
    
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt 
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
     
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.genAuthToken = async function () {
    const user = this;
    const token = jwt.sign({'_id': user._id.toString()}, 'tempSecret')
    user.tokens = user.tokens.concat({'token': token})
    await user.save()
    return token;
}

UserSchema.methods.toJSON = function () {
    const user = this;
    const pub = user.toObject();

    delete pub.tokens;
    delete pub.password;

    return pub;
}

UserSchema.statics.findByEmail = async (email, pass) => {
    try {
        const user = await User.findOne({email: email}) || await User.findOne({username: email})
        if(!user) { throw new Error('Unable to log in.'); }

        const match = await bcrypt.compare(pass, user.password);
        if(!match) { throw new Error('Unable to log in.'); }

        return user;
    }
    catch (err) {
        console.log(err)
    }
}
const User = mongoose.model('User', UserSchema);
module.exports = User;