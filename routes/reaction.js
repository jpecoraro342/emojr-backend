var Reaction = require('../models/reaction');
var Post = require('../models/post');
var User = require('../models/user');
var express = require('express');
var pgquery = require('../pgquery');
var router = express.Router();

router.route('/reactions')
	.get(function(req, res) {
		var queryString = "SELECT * FROM Reactions;";

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

router.route('/reaction')
	.post(function(req, res) {
		var reaction = new Reaction(req.body);
		var queryString = "INSERT INTO Reactions (fk_userid, fk_postid, reaction)\n" + 
						"VALUES ($1, $2, $3)\n" + 
						"RETURNING Reactions.pk_reactionid, Reactions.fk_userid, Reactions.fk_postid;"
		
		pgquery.query(queryString, [reaction.fk_userid, reaction.fk_postid, reaction.reaction], function(err, result){
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				return res.send(result.rows[0]);
			}
		});
	});

router.route('/reaction/:reactionid')
	.get(function(req, res) {
		var queryString = "SELECT * FROM Reactions where pk_reactionid=$1;"
		pgquery.query(queryString, [req.params.reactionid], function(err, result){
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				return res.send(result.rows[0]);
			}
		});
	})

router.route('/reactions/user/:userid')
	.get(function(req, res) {
		var queryString = "SELECT * FROM Reactions where fk_userid=$1;"
		pgquery.query(queryString, [req.params.userid], function(err, result){
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				return res.send(result.rows);
			}
		});
	})

router.route('/reactions/post/:postid')
	.get(function(req, res) {
		var queryString = "SELECT * FROM Reactions where fk_postid=$1;"
		pgquery.query(queryString, [req.params.postid], function(err, result){
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				return res.send(result.rows);
			}
		});
	})


module.exports = router;