const express = require("express");
const app = express();
const userdataRoutes = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../config");
const { MongoDB } = require('mongodb');
const cors = require("cors");
const userdata = require("../models/userdata");



userdataRoutes.all("*", cors(config.corsOptions));

//Route to check for in-use email
userdataRoutes.route("/email").post((req, res) => {
  userDB = req.app.locals.db.db('Munch').collection('User');
  userDB.findOne({ email: req.body.email }).then(check => {
    res.status(check == null ? 200 : 500).send();
  })
})

// Register route
userdataRoutes.route("/register").post((req, res) => {

  userDB = req.app.locals.db.db('Munch').collection('User');

  user = userdata;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  userDB.insertOne(user.json())
    .then(() => res.status(200).send({
      accessToken: jwt.sign({ _uid: user._uid }, config.secret, { expiresIn: "12h" }),
      refreshToken: jwt.sign({ _uid: user._uid }, config.secret, { expiresIn: "72h" })
    }))
    .catch((err) => res.status(500).send(err));


});

//Token  login
userdataRoutes.route("/token").post((req, res) => {
  switch (req.body.token) {
    case undefined:
      res.status(205).send({ message: "No access token." });
      break;
    default:
      jwt.verify(req.body.token, config.secret, (err, decoded) => {
        switch (decoded) {
          case undefined:
            res.status(205).send({ error: err });
            break;
          default:
            res.status(200).send({
              accessToken: jwt.sign({ _uid: user._uid }, config.secret, { expiresIn: "12h" }),
              refreshToken: jwt.sign({ _uid: user._uid }, config.secret, { expiresIn: "72h" })
            });
        }
      });
  }
});

//Login route
userdataRoutes.route("/login").post((req, res) => {

  userDB = req.app.locals.db.db('Munch').collection('User');

  //check for user existing and fetch if so....
  userDB.findOne({ email: req.body.email })
    .then(user => {
      if (user == null) {
        //...and reject if not.
        res.status(500).send({ message: 'Incorrect login.' });
      } else {
        user = Object.assign(userdata, user);
        //Check if correct password...
        if (!user.validPassword(req.body.password)) {
          //...reject if not...
          res.status(500).send({ message: 'Incorrect login.' });
        } else {
          //...send jwt if so.
          res.status(200).send({
            accessToken: jwt.sign({ _uid: user._uid }, config.secret, { expiresIn: "12h" }),
            refreshToken: jwt.sign({ _uid: user._uid }, config.secret, { expiresIn: "72h" })
          });
        }
      }
    })
    .catch(err => {
      //unlikely but possible error. Add specific handling as they happen.
      console.log(err);
      res.status(500).send({ error: err });
    });
});

//Logout route
userdataRoutes.route("/logout").post((req, res) => {
  //Simple, delete jwts.
  res.status(201).clearCookie("munchToken", { path: "/" }).send();
});

module.exports = userdataRoutes;
