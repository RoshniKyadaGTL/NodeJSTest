let mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: String
});

module.exports = mongoose.model('user', UserSchema);

