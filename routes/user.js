var User = require('../models/user');
var pgquery = require('../pgquery');
var express = require('express');
var router = express.Router();

router.route('/users')
	.get(function(req, res) {
		User.find({})
		.select("-password")
		.select("-salt")
		.exec(function(err, users) {
			if (err) {
				return res.send(err);
			}

			res.json(users);
		});
	})

router.route('/user')
	.post(function(req, res) {
		var user = new User(req.body);

		user.save(function(err) {
			if (err) {
				return res.send(err);
			}

			user.password = undefined;
			user.salt = undefined;

			res.send(user);
		});
	});

router.route('/user/available')
	.post(function(req, res) {
		User.findOne({
            username: req.body.username
        }, (err, user) => {
            if (err) {
                return res.send(err);
            }
            if (user) {
                return res.send({ available: false});
            }

            res.send({available: true});
        });
	});

router.route('/user/signup')
	.post(function(req, res) {
		var user = new User(req.body);
		var queryString = "INSERT INTO Users (username, userfullname, password, salt) VALUES ($1::text, $2::text, $3::text, $4::text);"
		
		user.presave();

		pgquery.query(queryString, [user.username, user.userfullname, user.password, user.salt], function(err, result){
			console.log(err);
			console.log(result);
			if (err) {
				return res.status(500).send(err);
			}
			else {
				return res.send(result);
			}
		});
	});

router.route('/user/signin')
	.post(function(req, res) {
		User.findOne({
            username: req.body.username
        }, (err, user) => {
            if (err) {
                return res.send(err);
            }
            if (!user || !user.authenticate(req.body.password)) {
                return res.status(403).send({
                	message: 'Invalid username or password'
                });
            }

            user.password = undefined;
            user.salt = undefined;

            res.send(user);
        });
	});

module.exports = router;