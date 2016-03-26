'use strict';
/*global require, __dirname*/

let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let config = require('./config');

var users = require('./routes/user');

var app = express();

// Connect to database.
mongoose.connect(config.mongo_url);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use('/api', users);

module.exports = app;

app.listen(config.port, () => {
    console.log("Up and listening! go to http://localhost:3000");
});
