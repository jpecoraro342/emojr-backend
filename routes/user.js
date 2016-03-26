var User = require('../models/user');
var express = require('express');
var router = express.Router();

router.route('/user')
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

		user.save(function(err) {
			if (err) {
				return res.send(err);
			}

			user.password = undefined;
			user.salt = undefined;

			res.send(user);
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

	// User.find({}, {
	// 	_id: true,
	// 	username: true,
	// 	fullname: true
	// }).exec(function(err, users) {
	// 	if (err) {
	// 		return res.send(err);
	// 	}

	// 	res.json(users);
	// });