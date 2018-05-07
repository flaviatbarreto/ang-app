var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

router.post('/', function (req, res, next) {
    var user = new User ({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email
    })

    user.save((err, result) => {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }

        res.status(201).json({
            message: 'User created',
            obj: result
        })
    })
});

router.post('/signin', (req, res, next) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }

        if (!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            })
        }

        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            })
        }

        var token = jwt.sign({user: user}, 'secret123', {expiresIn: 7200});

        res.status(200).json({
            message: 'Succesfully logged in',
            token: token,
            userID: user._id
        })
    });
});

module.exports = router;
