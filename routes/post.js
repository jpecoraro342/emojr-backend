var Post = require('../models/post');
var Reaction = require('../models/reaction');
var User = require('../models/user');
var pgquery = require('../pgquery');
var express = require('express');
var router = express.Router();

router.route('/posts')
	.get(function(req, res) {
		var queryString = postQuery();

		pgquery.query(queryString, null, function(err, result){
			if (err) {
				console.log(err);
				console.log(queryString);
				return res.status(500).send(err);
			}
			else {
				return res.send(result.rows);
			}
		});
	});

router.route('/post')
	.post(function(req, res) {
		var post = new Post(req.body);
		var queryString = "INSERT INTO Posts (fk_userid, post)\n" + 
						"VALUES ($1, $2)\n" + 
						"RETURNING Posts.pk_postid, Posts.fk_userid, Posts.post;"
		
		pgquery.query(queryString, [post.fk_userid, post.post], function(err, result){
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				return res.send(result.rows[0]);
			}
		});
	});

router.route('/post/:postid')
	.get(function(req, res) {
		var queryString = postQuery("WHERE Posts.pk_postid=$1");

		pgquery.query(queryString, [req.params.postid], function(err, result){
			if (err) {
				console.log(err);
				console.log(queryString);
				return res.status(500).send(err);
			}
			else {
				return res.send(result.rows);
			}
		});
	});

router.route('/posts/user/:userid')
	.get(function(req, res) {
		var queryString = postQuery("WHERE Posts.fk_userid=$1");

		pgquery.query(queryString, [req.params.userid], function(err, result){
			if (err) {
				console.log(err);
				console.log(queryString);
				return res.status(500).send(err);
			}
			else {
				return res.send(result.rows);
			}
		});
	});

router.route('/posts/following/:userid')
	.get(function(req, res) {
		var queryString = postQuery("INNER JOIN Followers ON Followers.fk_followinguserid=Users.pk_userid\n" + 
						"WHERE Followers.fk_followeruserid = $1");

		pgquery.query(queryString, [req.params.userid], function(err, result){
			if (err) {
				console.log(err);
				console.log(queryString);
				return res.status(500).send(err);
			}
			else {
				return res.send(result.rows);
			}
		});
	});

function postQuery(additionalQuery) {
	if (additionalQuery == null) {
		return basePostsQuery() + postGrouping() + ";";
	}

	return basePostsQuery() + additionalQuery + "\n" + postGrouping() + ";";
}

function basePostsQuery() {
	return "SELECT Users.pk_userid, Users.username, Posts.pk_postid, Posts.post, Posts.created, Posts.lastmodified,\n" +
		"JSON_AGG((SELECT r FROM (SELECT Reactions.pk_reactionid, Reactions.reaction) r)) as reactions\n" +
		"FROM Posts\n" +
		"INNER JOIN Reactions ON Posts.pk_postid = Reactions.fk_postid\n" +
		"INNER JOIN Users ON Posts.fk_userid = Users.pk_userid\n";
}

function postGrouping() {
	return "GROUP BY Posts.pk_postid, Users.pk_userid, Users.username";
}


module.exports = router;