let express = require('express');
let UserModel = require('../models/user.model');

let jwt = require('jsonwebtoken');
let config = require('../config');
let middleware = require('../middleware');
let logger = require('../logger');
let router = express.Router();

// Create a new user - POST API
router.post('/user/register', (req, res) => {
    // save logic req.body
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send('Request body is missing!');
    }

    let model = new UserModel(req.body);
    model.save()
        .then(doc => {
            if (!doc || doc.length === 0) {
                return res.status(500).send(doc);
            }
            res.status(201).send(doc);
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
        });
});

// Create a new user - POST API
router.get('/user/login', (req, res) => {
    // save logic req.body
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send('Request body is missing!');
    }

    let _email = req.body.email
    let _pw = req.body.password

    if (_email && _pw) {
        UserModel.findOne({
            email: _email, password: _pw
        }).then(doc => {
            if (doc) {
                let token = jwt.sign({ email: _email },
                    config.secret,
                    {
                        expiresIn: '24h' // expires in 24 hours
                    }
                );
                // return the JWT token for the future API calls
                res.json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token
                });
            } else {
                // logger.log({
                //     level: 'error',
                //     message: 'Hello distributed log files!'
                //   });
                res.status(403).json({
                    success: false,
                    message: 'Incorrect username or password'
                });

            }
        })
            .catch(err => {
                logger.log({
                    level: 'error',
                    message: err
                });
            });
    }

});

//Check Token
router.get('/verifytoken', middleware.checkToken, (req, res) => {
    res.send('Verified token');
});

// Get Customer Get API
router.get('/userall', (req, res) => {

    UserModel.find({
    })
        .then(doc => {
            res.status(201).send(doc);
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
        });
});

module.exports = router;