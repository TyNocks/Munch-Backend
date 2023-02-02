const express = require('express');
const auth = require('../middleware/auth');
const Recipe = require('../models/recipeModel');
const User = require('../models/userModel');

router = express.Router();

/*
*
* Create new recipe
*
*/

router.post('/new', auth, async (req, res) => {
    try {
        keywords = new Set([...req.body.keywords.split(" "), ...req.body.title.split(" ")]);
        keywords = [...keywords].join(' ');
        let recipe = {
            uid: req.user._id,
            title: req.body.title,
            created: new Date(),
            modified: new Date(),
            ingredients: req.body.ingredients,
            amounts: req.body.amounts,
            steps: req.body.steps,
            keywords: keywords
        };
        rec = new Recipe(recipe);
        await rec.save()
        res.send({ _id: rec._id });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

/*
*
*  Search for recipe
*
*/

router.post('/search', async (req, res) => {
    try {
        recipes = await Recipe.aggregate([
            {
                '$search': {
                    'index': 'RecipeSearch',
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

        res.send(recipes)
    } catch (err) {
        res.status(500).send({ 'error': err })
    }
});

/*
*
* Recipe search autocomplete
*
*/

router.post('/autocomplete', async (req, res) => {
    try {
        titles = await Recipe.aggregate([
            {
                $search: {
                  index: 'RecipeSearchAutocomplete',
                  text: {
                    query: req.body['term'],
                    path: {
                      'wildcard': '*'
                    }
                  }
                }
              },
            {$limit : 5},
            {$project: {_id: 0, title: 1}}
        ])
        res.send(titles);;
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

/*
*
* Get full recipe details
*
*/

router.post('/id', async (req, res) => {
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

/* 
*
* Favorite a recipe (toggle)
*
*/

router.post('/fav', auth, async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        if (user.favorites.includes(req.body._id)) {
            await Recipe.findOneAndUpdate({ _id: req.body._id }, { "$inc": { favorites: -1 } });
            user.favorites.splice(user.favorites.indexOf(req.body._id), 1);
            user.save();
            res.send(user);
        } else {
            await Recipe.findOneAndUpdate({ _id: req.body._id }, { "$inc": { favorites: 1 } });
            user.favorites.push(req.body._id);
            user.save();
            res.send(user);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

/*
*
* Get favorites
*
*/

router.get('/fav', auth, async (req, res) => {
    try {
        res.send(req.user.favorites);
    } catch (err) {
        res.status(500).send(err);
    }
});

/*
*
* Update recipe
*
*/

router.patch('/id', auth, async (req, res) => {
    try {
        update = {
            ingredients: req.body.ingredients,
            steps: req.body.steps
        }
        Recipe.findOneAndUpdate({ _id: req.body._id, uid: req.user }, update)
            .then(rec => res.send({ _id: req.body._id }));
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

module.exports = router