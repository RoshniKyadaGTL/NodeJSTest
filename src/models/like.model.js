let mongoose = require('mongoose');

let LikeSchema = mongoose.Schema({
    commentId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    flag: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('likes', LikeSchema);

