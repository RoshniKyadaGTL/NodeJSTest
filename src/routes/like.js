let express = require('express');
let LikeModel = require('../models/like.model');
let jwt = require('jsonwebtoken');
const config = require('../config');
let router = express.Router();
let logger = require("../logger");

// like/dislike comment - POST API
router.post('/comment/like_dislike', (req, res) => {
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
                let model = new LikeModel(req.body);
                LikeModel.findOneAndUpdate({
                    commentId: model.commentId
                }, req.body, { new: true })
                    .then(doc => {
                        if (!doc || doc.length === 0) {
                            model.save()
                                .then(doc => {
                                    if (!doc || doc.length === 0) {
                                        return res.status(500).send(doc);
                                    }
                                    res.status(201).json({
                                        status: true,
                                        message: 'Successfully created.',
                                    });
                                })
                                .catch(err => {
                                    res.status(500).json(err);
                                });
                            // return res.status(500).send(doc);
                        }
                        res.status(201).json({
                            status: true,
                            message: 'Successfully updated.',
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