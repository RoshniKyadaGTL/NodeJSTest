let express = require('express');
let CommentModel = require('../models/comment.model');
let jwt = require('jsonwebtoken');
const config = require('../config');
let router = express.Router();
let logger = require("../logger");

// Post new comment - POST API
router.post('/comment/create', (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send('Request body is missing!');
    }
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                var userEmail = decoded.email;
                // req.json({author : decoded.Object.})
                let model = new CommentModel(req.body);
                model.userName = userEmail;
                model.save()
                    .then(doc => {
                        if (!doc || doc.length === 0) {
                            return res.status(500).send(doc);
                        }
                        res.status(201).json({
                            status: true,
                            message: 'Successfully posted comment.',
                            blog: model
                        });
                    })
                    .catch(err => {
                        logger.log({
                            level: 'error',
                            message: err
                        });
                    });
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
});

// Update comment - POST API
router.put('/comment/update', (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send('Request body is missing!');
    }
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                let model = new CommentModel(req.body);
                CommentModel.findOneAndUpdate({
                    _id: model._id,
                    userName: decoded.email
                }, req.body, { new: true })
                    .then(doc => {
                        if (!doc || doc.length === 0) {
                            return res.status(500).json({
                                status: false,
                                message: "Invalid ID!"
                            });
                        }
                        res.status(201).json({
                            status: true,
                            message: 'Successfully updated comment.',
                            comment: model
                        });
                    })
                    .catch(err => {
                        logger.log({
                            level: 'error',
                            message: err
                        });
                    });
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
});

// Get comments of blog - GET API
router.get('/comment/blog', (req, res) => {
    // if (Object.keys(req.body).length === 0) {
    //     return res.status(400).send('Request body is missing!');
    // }
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                CommentModel.find({
                    blogUrl: req.body.blogUrl
                })
                    .then(doc => {
                        res.status(201).json({
                            status: true,
                            comments: doc
                        });
                    })
                    .catch(err => {
                        logger.log({
                            level: 'error',
                            message: err
                        });
                    });
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
});

// Delete comment - DELETE API
router.delete('/comment', (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send('Request body is missing!');
    }
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                CommentModel.deleteOne({
                    _id: req.body._id
                })
                    .then(doc => {
                        res.status(201).json({
                            message: 'Successfully deleted comment.',
                            status: true
                        });
                    })
                    .catch(err => {
                        logger.log({
                            level: 'error',
                            message: err
                        });
                    });
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
});

module.exports = router;