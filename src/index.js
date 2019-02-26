let express = require('express');

let app = express(); // Create an express application
let userRoute = require('./routes/user');
let blogRoute = require('./routes/blog');
let commentRoute = require('./routes/comment');
let likeRoute = require('./routes/like');
let path = require('path');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

app.use(bodyParser.json()); // Now we have access to req.body
app.use(userRoute);
app.use(blogRoute);
app.use(commentRoute);
app.use(likeRoute);
app.use(express.static('public'));
app.use((req, res, next) => {
    // res.send(`${new Date().toString()} => ${req.originalUrl}`);
    console.log(`${new Date().toString()} => ${req.originalUrl} ${req.body}`);
    next();
});



// Error Handling

// 404 - Not found error
app.use((req, res, next) => {
    res.status(404).send('We think you are lost.');
    next();
});

// 500 - Internal server error
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.sendFile(path.join(__dirname, '../public/500.html'));
    next();
});


const connection = require('./connection.string');

app.set('port', connection.port);
app.listen(app.get('port'), err => {
  if(err) console.error(err);
  console.log(`Server listening on port ${app.get('port')}...`);
  const db = mongoose.connect(connection.db);
  mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${connection.db}`);
  });
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.info(`Server has started on ${PORT}`));

