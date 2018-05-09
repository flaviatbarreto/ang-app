var express = require('express');
var jwt = require('jsonwebtoken');

var router = express.Router();

var Message = require('../models/message')
var User = require('../models/user')

router.get('/', function(req, res, next) {
    Message.find()
        .populate('user', 'firstName')
        .exec(function(err, messages){
            if(err){
                return res.status(500).json({
                    title: "An error occurred",
                    error: err
                })
            }

            res.status(200).json({
                message: 'Success',
                obj: messages
            })
        })
})

router.use('/', (req, res, next) => {
    jwt.verify(req.query.token, 'secret123', (err, decoded) => {
        if (err) {
            return res.status(401).json({
                title: "Not authenticated",
                error: err
            })
        }
        next()
    })
})

router.post('/', function (req, res, next) {
    var decoded = jwt.decode(req.query.token)

    User.findById(decoded.user._id, (err, user) => {
        if(err){
            return res.status(500).json({
                title: "An error occurred",
                error: err
            })
        }

        var message = new Message({
            content: req.body.content,
            user: user._id
        })

        message.save(function(err, result){
            if(err){
                return res.status(500).json({
                    title: "An error occurred",
                    error: err
                })
            }
            user.messages.push(result);
            user.save();
            result.user = user; // CHANGE HERE
            res.status(201).json({
                message: "Message saved successfully",
                obj: result
            })
        })
    })
});

// update an message
router.patch('/:id', function(req, res, next){
    var decoded = jwt.decode(req.query.token)

    Message.findById(req.params.id, function(err, message){
        if(err){
            return res.status(500).json({
                title: "An error occurred",
                error: err
            })
        }

        if(!message){
            return res.status(500).json({
                title: "No message found",
                error: {message: "Message not found"}
            })
        }

        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: "Not authenticated",
                error: {message: "User not authenticated"}
            })
        }

        message.content = req.body.content
        message.save(function(err, result){
            if(err){
                return res.status(500).json({
                    title: "An error occurred",
                    error: err
                })
            }

            res.status(200).json({
                message: "Message updated successfully",
                obj: result
            })
        })
    })
})

router.delete('/:id', (req, res, next) => {
    var decoded = jwt.decode(req.query.token)

    Message.findById(req.params.id, function(err, message){
        if(err){
            return res.status(500).json({
                title: "An error occurred",
                error: err
            })
        }

        if(!message){
            return res.status(500).json({
                title: "No message found",
                error: {message: "Message not found"}
            })
        }

        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: "Not authenticated",
                error: {message: "User not authenticated"}
            })
        }

        message.remove(function(err, result){
            if(err){
                return res.status(500).json({
                    title: "An error occurred",
                    error: err
                })
            }

            res.status(200).json({
                message: "Message deleted successfully",
                obj: result
            })
        })
    })
})

module.exports = router;
