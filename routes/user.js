var User = require('../models/user');
var pgquery = require('../pgquery');
var express = require('express');
var router = express.Router();

router.route('/users')
	.get(function(req, res) {
		var queryString = "SELECT Users.pk_userid, Users.username, Users.userfullname FROM Users;";

		pgquery.query(queryString, null, function(err, result){
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				return res.send(result.rows);
			}
		});
	})

router.route('/user')
	.post(function(req, res) {
		var user = new User(req.body);
		var queryString = "INSERT INTO Users (username, userfullname, password, salt)\n" + 
		"VALUES ($1::text, $2::text, $3::text, $4::text)\n" + 
		"RETURNING Users.pk_userid, Users.username, Users.userfullname;"
		
		user.presave();

		pgquery.query(queryString, [user.username, user.userfullname, user.password, user.salt], function(err, result){
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				return res.send(result.rows[0]);
			}
		});
	});

router.route('/user/available')
	.post(function(req, res) {
		var queryString = "SELECT Users.username FROM Users WHERE Users.username=$1;";
		pgquery.query(queryString, [req.body.username], function(err, result){
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				if (result.rowCount > 0) {
					return res.send({ available: false});
				}
				return res.send({available: true});
			}
		});
	});

router.route('/user/signup')
	.post(function(req, res) {
		var user = new User(req.body);
		var queryString = "INSERT INTO Users (username, userfullname, password, salt)\n" + 
		"VALUES ($1::text, $2::text, $3::text, $4::text)\n" + 
		"RETURNING Users.pk_userid, Users.username, Users.userfullname;";
		
		user.presave();

		pgquery.query(queryString, [user.username, user.userfullname, user.password, user.salt], function(err, result){
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				return res.send(result.rows[0]);
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