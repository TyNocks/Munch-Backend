const express = require('express');
const {Ingredient} = require('../models/ingredientModel');
const auth = require('../middleware/auth');

router = express.Router();

router.post('/search', async (req, res) => {
    try {
        ings = await Ingredient.aggregate([
            {
                '$search': {
                    'index': 'search',
                    'text': {
                        'query': req.body['search'],
                        'path': {
                            'wildcard': '*'
                        }
                    }
                }
            },
            {
                '$limit': 10
            }
        ]);

        res.send(ings)
    } catch (err) {
        res.status(500).send({ 'error': err })
    }
});

router.post('/batch', async (req, res) => {
    try {
        const ings = await Ingredient.find({
            'fdc_id': {
                '$in': req.body['ingredients']
            }
        });
        res.send(ings);
    } catch (err) {
        res.status(500).send({ 'error': err });
    }
});

router.post('/detail', async (req, res) => {
    try {
        let ing = await Ingredient.findOne({
            "fdc_id": req.body['fdc_id']
        }).populate({
            path: 'nutrients',
            model: 'Nutrient',
            populate: {
                path: 'nutrient_name',
                model: 'nDef',
                select: 'name'
            }
        });

        res.send(ing);
    } catch (err) {
        res.status(500).send({err});
    }
});

module.exports = router;