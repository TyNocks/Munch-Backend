const jwt = require('jsonwebtoken');
const config = require('./config.js');

module.exports.tokenAuth = function (req, res, next) {
    switch (req.body.token) {
        case undefined:
          return res.status(401).send({ message: "No token sent." })
        default:
          jwt.verify(req.body.token, config.secret, (err, decoded) => {
            switch (decoded) {
              case undefined:
                res.status(403).send({ message: "Invalid token.", error: err });
                break;
              default:
                next();
            }
          });
      }
}