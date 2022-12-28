const jwt = require('jsonwebtoken');
const User = require('../models/userModel')

const auth = async function (req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'tempSecret');
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});

        if(!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next()
    } catch (err) {
        res.status(401).send({error: 'Please login.'})
    }
}

module.exports = auth