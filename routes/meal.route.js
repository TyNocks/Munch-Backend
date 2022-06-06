const express = require("express");
const mealRoutes = express.Router();
const config = require("../config");
const ObjectID = require('mongodb').ObjectId;
const cors = require("cors");

mealRoutes.all("*", cors(config.corsOptions));

//
// New meal route.
//

mealRoutes.route("/new").post( function(req, res) {

    mealDB = req.app.locals.db.db('Munch').collection('Meals');
    switch(req.body == undefined) {
        case undefined:
            res.status(205).send({'error': 'No meal data.'});
            break;
        default:
            req.body['_id'] = new ObjectID()
            req.body['date'] = new Date(req.body['date'])
            mealDB.insertOne(req.body)
            .then( x => res.status(200).send({mealID: req.body._id}))
            .catch( err => {
                console.log(err)
                res.status(500).send({error: err})
            });
    }
});

//
// Lookup my meal id. Likely only used directly after new meal creation.
//

mealRoutes.route('/id').post( function (req, res) {

    mealDB = req.app.locals.db.db('Munch').collection('Meals');
    switch(req.body?._id == undefined) {
        case undefined:
            res.status(205).send({'error': 'No meal id.'});
            break;
        default:
            mealDB.findOne({_id: new ObjectID(req.body['_id'])})
            .then(x => res.send(x))
            .catch(err => res.status(500).send(err));
            break;
    }
});

//
// Lookup my datetime and user id. Primary lookup method.
//

mealRoutes.route('/lookup').post( function (req, res) {

    mealDB = req.app.locals.db.db('Munch').collection('Meals');
    switch(req.body == undefined) {
        case undefined:
            res.status(205).send({'error': 'No search data.'});
            break;
        default:
            mealDB.findOne({_uid: req.body._uid, date: new Date(req.body.date)})
            .then(x => res.status(200).send(x))
            .catch(err => res.status(500).send(err));
            break;
    }
});

//
// Update meal by _id.
//

mealRoutes.route('/update').post( function (req, res) {
    mealDB = req.app.locals.db.db('Munch').collection('Meals');
    switch(req.body == undefined) {
        case undefined:
            res.status(205).send({'error': 'No update data.'});
            break;
        default:
            req.body._id = new ObjectID(req.body._id);
            req.body.date = new Date(req.body.date);
            mealDB.findOneAndUpdate({_id: req.body._id}, {'$set': req.body})
            .then(x => res.status(200).send(x))
            .catch(err => res.status(500).send(err));
            break;
    }
});

//
// Delete meal by _id.
//

mealRoutes.route('/delete').post( function (req, res) {
    mealDB = req.app.locals.db.db('Munch').collection('Meals');
    switch(req.body == undefined) {
        case undefined:
            res.status(205).send({'error': 'No delete data.'});
            break;
        default:
            req.body._id = new ObjectID(req.body._id);
            mealDB.deleteOne({_id: req.body._id})
            .then(x => {
                if (x.deletedCount == 1) {
                    res.status(200).send({message: 'success'})
                } else {
                    res.status(500).send({message: 'something went wrong in deletion.'})
                }
            })
            .catch(err => res.status(500).send(err));
            break;
    }
});

module.exports = mealRoutes