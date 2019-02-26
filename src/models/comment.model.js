let mongoose = require('mongoose');

let CommentSchema = mongoose.Schema({
    userName: {
        type: String,
        required: false
    },
    userEmail: {
        type: String,
        required: false
    },
    comment: {
        type: String,
        required: true
    }, 
    blogUrl: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    updated: {
      type: Date
    }
});

module.exports = mongoose.model('comment', CommentSchema);

