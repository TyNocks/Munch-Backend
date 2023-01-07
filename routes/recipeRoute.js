const express = require('express');
const auth = require('../middleware/auth');
const Recipe = require('../models/recipeModel');

router = express.Router();

router.post('/new', auth, async (req, res) => {
    try {
        let recipe = {
            uid: req.user._id,
            created: new Date(),
            modified: new Date(),
            ingredients: req.body.ingredients,
            amounts: req.body.amounts,
            steps: req.body.steps
        }
        rec = new Recipe(recipe);
        await rec.save()
        res.send({_id: rec._id});
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/id', auth, async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.body._id)
            .populate({
                path: 'ingredients',
                populate: {
                    path: "nutrients",
                    populate: {
                        path: "nutrient_name"
                    }
                }
            });
        res.send(recipe);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

router.patch('/id', auth, async (req, res) => {
    try {
        update = {
            ingredients: req.body.ingredients,
            steps: req.body.steps
        }
        Recipe.findOneAndUpdate({_id: req.body._id, uid: req.user}, update)
            .then( rec => res.send({_id: req.body._id}));
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

module.exports = router