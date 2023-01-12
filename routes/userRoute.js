const express = require('express');
const User = require('../models/userModel');
const auth = require('../middleware/auth')

router = express.Router();

/*
*
* Create new user.
*
*/

router.post('/register', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.genAuthToken();
        res.status(201).send({ 'user': user, 'token': token });
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ error: err })
    }
});

/*
*
* Login
*
*/

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByEmail(req.body.email, req.body.password);
        const token = await user.genAuthToken();
        res.status(200).send({ 'user': user, 'token': token });
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ error: err })
    }
});

/*
*
* Logout
*
*/

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((t) => {
            return t.token != req.token
        })
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send({error: err})
    }
});

/*
*
* Logout from all devices.
* Deletes all saved login tokens.
*
*/

router.post('/logout/all', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send({error: err})
    }
});

/*
*
* Get details about current account.
*
*/

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findOne({'_id': req.user});
        res.status(200).send(user)
    } catch (err) {
        res.status(501).send({error: err})
    }
});

/*
*
* Delete account.
*
*/
router.delete('/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne({'_id': req.user});
        res.send()
    } catch (err) {
        res.status(400).send({'error': err});
    }

});

/*
*
* Update account information.
*
*/

router.patch('/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'password'];
    const isValid = updates.every((update) => allowedUpdates.includes(update));

    if (!isValid) {
        return res.status(400).send({'error': 'Invalid updates.'})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (err) {
        res.status(400).send({'error': err});
    }
});

module.exports = router;