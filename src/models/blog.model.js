let mongoose = require('mongoose');

let BlogSchema = mongoose.Schema({
    author: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: true,
        unique: true
      },
      title: {
        type: String,
        required: true
      },
      body: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      tags: [String],
      updated: {
        type: Date
      }
});

module.exports = mongoose.model('blog', BlogSchema);

