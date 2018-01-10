var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function (req, res, next) {
    res.render('message');
});

router.post('/', function (req, res, next) {
    var user = new User({
        firstName: 'Flávia',
        lastName: 'Barreto',
        password: '123',
        email: req.body.email
    });
    user.save();
    res.redirect('/');
});

module.exports = router;
