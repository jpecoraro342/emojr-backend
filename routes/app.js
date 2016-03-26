'use strict';
/*global require, __dirname*/

let express = require('express');
let session = require('express-session');
let mongoose = require('mongoose');
let MongoStore = require('connect-mongo')(session);
let bodyParser = require('body-parser');
let passport = require('passport');
let config = require('../config');

var app = express();

// Connect to database.
mongoose.connect(config.mongo_url);

// Express MongoDB session storage
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    cookie: {
        maxAge: config.sessionCookie.maxAge,
        httpOnly: config.sessionCookie.httpOnly,
        secure: config.sessionCookie.secure && config.secure.ssl
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection: config.sessionCollection
    })
}));

app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

app.listen(3000, () => {
    console.log("Up and listening! go to http://localhost:3000");
});
