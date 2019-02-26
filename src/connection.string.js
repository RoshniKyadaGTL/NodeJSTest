const connection = {
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost:27017/test'
  }
  module.exports = connection;