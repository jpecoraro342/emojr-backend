var User = require('../models/users');
var express = require('express');
var router = express.Router();

router.route('/users')
	.get(function(req, res) {
		User.find(function(err, users) {
			if (err) {
				return res.send(err);
			}

			res.json(users);
		});
	})
	.post(function(req, res) {
		//TODO: Validation and salting and such
		var user = new User(req.body);

		user.save(function(err) {
			if (err) {
				return res.send(err);
			}

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