var User = require('../models/user');
var pgquery = require('../pgquery');
var express = require('express');
var router = express.Router();

router.route('/users')
	.get(function(req, res) {
		var queryParams = null;

		var queryString = "SELECT Users.pk_userid, Users.username FROM Users\n";

		if (req.query.searchString != null) {
			queryString = queryString + "WHERE Users.username LIKE '' || $1::text || '%'\n"; 
			queryParams = [req.query.searchString]
		}
		queryString = queryString + "LIMIT 100;";

		pgquery.query(queryString, queryParams, function(err, result){
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				return res.send(result.rows);
			}
		});
	});

router.route('/user')
	.post(function(req, res) {
		var user = new User(req.body);
		var queryString = "INSERT INTO Users (username, password, salt)\n" + 
		"VALUES ($1::text, $2::text, $3::text, $4::text)\n" + 
		"RETURNING Users.pk_userid, Users.username;"
		
		user.presave();

		pgquery.query(queryString, [user.username, user.password, user.salt], function(err, result){
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
		var queryString = "INSERT INTO Users (username, password, salt)\n" + 
		"VALUES ($1::text, $2::text, $3::text, $4::text)\n" + 
		"RETURNING Users.pk_userid, Users.username;";
		
		user.presave();

		pgquery.query(queryString, [user.username, user.password, user.salt], function(err, result){
			if (err) {
				err.error = err.toString();
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
		var queryString = "SELECT * FROM Users WHERE Users.username=$1;";
		pgquery.query(queryString, [req.body.username], function(err, result){
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				if (result.rowCount > 0) {
					var user = new User(result.rows[0]);

					if (user.authenticate(req.body.password)) {
						user.password = undefined;
						user.salt = undefined;
						return res.send(user);
					}
				}

				return res.status(403).send({
                	message: 'Invalid username or password'
                });
			}
		});
	});

module.exports = router;