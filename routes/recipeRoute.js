const express = require('express');
const User = require('../models/userModel');
const auth = require('../middleware/auth')

router = express.Router();

router.post('/new', auth, async (req, res) => {
    
})

module.exports = router