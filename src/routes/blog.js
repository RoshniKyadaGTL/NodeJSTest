let express = require('express');
let BlogModel = require('../models/blog.model');
let jwt = require('jsonwebtoken');
const config = require('../config');
let router = express.Router();
let logger = require("../logger");

// Create a new blog - POST API
router.post('/blog/publish', (req, res) => {
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
                let model = new BlogModel(req.body);
                model.author = userEmail;
                model.save()
                    .then(doc => {
                        if (!doc || doc.length === 0) {
                            return res.status(500).send(doc);
                        }
                        res.status(201).json({
                            status: true,
                            message: 'Successfully published blog post.',
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

// Update blog - POST API
router.put('/blog/update', (req, res) => {
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
                let model = new BlogModel(req.body);
                BlogModel.findOneAndUpdate({
                    url: model.url,
                    author: decoded.email
                }, req.body, { new: true })
                    .then(doc => {
                        if (!doc || doc.length === 0) {
                            return res.status(500).json({
                                status: false,
                                message : "Invalid URL!"
                            });
                        }
                        res.status(201).json({
                            status: true,
                            message: 'Successfully updated blog post.',
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

// Get blogs by author - GET API
router.get('/blog/author', (req, res) => {
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
                BlogModel.find({
                    author: decoded.email
                })
                    .then(doc => {
                        res.status(201).json({
                            status: true,
                            blogs: doc
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

// Get all blogs - GET API
router.get('/blog/all', (req, res) => {
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
                BlogModel.find()
                    .then(doc => {
                        res.status(201).json({
                            status: true,
                            blogs: doc
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

// Delete blog - DELETE API
router.delete('/blog', (req, res) => {
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
                BlogModel.deleteOne({
                    url: req.body.url
                })
                    .then(doc => {
                        res.status(201).json({
                            message: 'Successfully deleted blog post.',
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