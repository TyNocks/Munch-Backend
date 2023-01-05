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
            ingredients: req.body.ingredients
        }
        rec = new Recipe(recipe);
        rec.save()
        res.send();
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/id', auth, async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.body._id)
            .populate({
                path: 'ingredients.ingredient'
            });
        res.send(recipe);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router