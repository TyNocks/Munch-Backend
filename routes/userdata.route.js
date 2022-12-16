const express = require("express");
const app = express();
const userdataRoutes = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../config");
const { MongoDB } = require('mongodb');
const cors = require("cors");
const userdata = require("../models/userdata");


userdataRoutes.all("*", cors(config.corsOptions));

// Register route
userdataRoutes.route("/register").post((req, res) => {

  userDB = req.app.locals.db.db('Munch').collection('User');

  userDB.find({ email: req.body.email }).toArray().then(check => {
    console.log(check);
    switch (check.length) {
      case 0:
        let user = userdata;
        user.email = req.body.email;
        console.log(user)
        user.setPassword(req.body.password);
        userDB.insertOne(user.json())
          .then(() => res.status(200).send({
            accessToken: jwt.sign({ _uid: user._uid }, config.secret, { expiresIn: "12h" }),
            refreshToken: jwt.sign({ _uid: user._uid }, config.secret, { expiresIn: "72h" })
          }))
          .catch((err) => res.status(500).send(err));
        break;
      default:
        res.status(500).send({ message: "Email already registered." });
        break;
    }
  });


});

//Token  login
userdataRoutes.route("/token").post((req, res) => {
  switch (req.body.token) {
    case undefined:
      res.status(205).send({message: "No access token."});
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

  userDB.findOne({ email: req.body.email })
    .then(user => {
      user = Object.assign(userdata, user);
      switch (user) {
        case null:
          res.status(500).send({ message: 'User not found.' });
          break;
        default:
          switch (user.validPassword(req.body.password)) {
            case false:
              res.status(500).send({ message: 'Password incorrect.' });
              break;
            case true:
              res.status(200).send({
                accessToken: jwt.sign({ _uid: user._uid }, config.secret, { expiresIn: "12h" }),
                refreshToken: jwt.sign({ _uid: user._uid }, config.secret, { expiresIn: "72h" })
              });
              break;
          }
          break;
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ error: err });
    });
});

//Logout route
userdataRoutes.route("/logout").post((req, res) => {
  res.status(201).clearCookie("munchToken", { path: "/" }).send();
});





//Meal list route
userdataRoutes.route("/list").post(function (req, res) {
  const a = req.body;
  UserData.findOne({ _uid: a._uid }).then((b) => {
    if (b) {
      b.mealData = checkData(b.mealData, a._year, a._month);
      res.status(200).json(b.mealData["_" + a._year]["_" + a._month]);
    }
  });
});

//Meal add route
userdataRoutes.route("/add").post(function (req, res) {
  let a = req.body;
  UserData.findOne({ _uid: a._uid }).then((b) => {
    b.mealData[a["day"]] = b.mealData[a["day"]] || {};
    b.mealData[a["day"]][a["Time"]] = { _rid: a._rid };
    let work = new UserData(b);
    work.save();
    res.status(200).json({ test: "end" });
  });
});

//Meal delete route
userdataRoutes.route("/delete").post(function (req, res) {
  const a = req.body;
  UserData.findOne({ _uid: a._uid })
    .then((b) => {
      b.mealData[a["day"]][a["Time"]] = undefined;
      let work = new UserData(b);
      work.save();
    })
    .then((c) => res.status(200).send());
});

//Meal add mobile re-write
userdataRoutes.route("/mobadd").post(function (req, res) {
  let a = req.body;

  UserData.findOne({ _uid: a._uid }).then((b) => {
    b.mealData[a["day"]] = b.mealData[a["day"]] || {};
    b.mealData[a["day"]][a["Time"]] = { _rid: a._rid };
    let work = new UserData(b);
    work.save();
    res.status(200).json({ test: "end" });
  });
});

//Meal get by day
userdataRoutes.route("/daymeal").post(function (req, res) {
  let a = req.body;
  UserData.findOne({ _uid: a._uid }).then((b) => {
    if (b) {
      if (b.mealData[a["day"]] != undefined) {
        console.log("found day");
        res.status(200).json(b.mealData[a["day"]]);
      } else {
        res.status(200).send();
      }
    }
    res.status(200).send();
  });
});

//Meal detail
userdataRoutes.route("/mealDetail").post(function (req, res) {
  let a = req.body;
  UserData.findOne({ _uid: a._uid }).then((b) => {
    if (b) {
      if (b.mealData[a["day"]] != undefined) {
        b.mealData[a["day"]][a["time"]] != undefined
          ? res.status(200).json(b.mealData[a["day"]][a["time"]])
          : res.status(200).send();
      } else {
        res.status(200).send();
      }
    }
    res.status(200).send();
  });
});

//Meal check
userdataRoutes.route("/hasMeal").post(function (req, res) {
  let a = req.body;
  UserData.findOne({ _uid: a._uid }).then((b) => {
    if (b) {
      if (b.mealData[a["day"]] != undefined) {
        res.status(200).json(b.mealData[a["day"]]);
      } else {
        res.status(200).send();
      }
    }
    res.status(200).send();
  });
});

//Fixes meal data
checkData = function (data, year, month, day) {
  if (!("_" + year in data)) {
    data["_" + year] = {};
  }
  if (!("_" + month in data["_" + year])) {
    data["_" + year]["_" + month] = {};
  }
  if (day) {
    if (!("_" + day in data["_" + year]["_" + month])) {
      data["_" + year]["_" + month]["_" + day] = {};
    }
  }
  return data;
};

passHash = function (password) { };

module.exports = userdataRoutes;
