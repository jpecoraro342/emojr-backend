var Post = require('../models/post');
var Reaction = require('../models/reaction');
var User = require('../models/user');
var pgquery = require('../pgquery');
var express = require('express');
var router = express.Router();

router.route('/posts')
	.get(function(req, res) {
		var dateClause = null;
		var sqlparams = [];

		if (req.query.fromDate != null) {
			dateClause = dateClauseGreaterThanWithParamNum(1);
			sqlparams = [new Date(req.query.fromDate)];
		}

		var queryString = postQuery(dateClause);

		pgquery.query(queryString, sqlparams, function(err, result){
			if (err) {
				console.log('Error getting posts:');
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				console.log('Success getting posts!');
				return res.send(result.rows);
			}
		});
	});

router.route('/post')
	.post(function(req, res) {
		var post = new Post(req.body);
		var queryString = "INSERT INTO Posts (fk_userid, post)\n" + 
						"VALUES ($1, $2)\n" + 
						"RETURNING Posts.pk_postid, Posts.fk_userid, Posts.post, Posts.created;"
		
		pgquery.query(queryString, [post.fk_userid, post.post], function(err, result){
			if (err) {
				console.log('Error posting post:');
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				console.log('Success posting post!');
				return res.send(result.rows[0]);
			}
		});
	});

router.route('/post/:postid')
	.get(function(req, res) {
		var queryString = postQuery("WHERE Posts.pk_postid=$1");

		pgquery.query(queryString, [req.params.postid], function(err, result){
			if (err) {
				console.log('Error getting post:');
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				console.log('Success getting post!');
				return res.send(result.rows);
			}
		});
	});

router.route('/posts/discover')
	.get(function(req, res) {
		var sqlparams = [];

		var queryString = "SELECT * FROM vw_DiscoverPosts\n";

		console.log('Query Parameters on request');
		console.log(req.query);

		if (req.query.userId != null) {
			console.log('Discover posts: User ID was there')
			queryString = queryString + "WHERE pk_userid <> $1::int"; 
			sqlparams = [req.query.userId]
		}

		queryString = queryString + "\nLIMIT 100;";

		pgquery.query(queryString, sqlparams, function(err, result){
			if (err) {
				console.log('Error getting discover:');
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				console.log('Success getting discover!');
				return res.send(result.rows);
			}
		});
	});

router.route('/posts/discover/:lastcreateddate')
	.get(function(req, res) {
		var sqlparams = [];

		var queryString = "SELECT * FROM vw_DiscoverPosts\n";

		dateClause = dateClauseGreaterThanWithParamNum(1);
		sqlparams.push(new Date(req.params.lastcreateddate));
		queryString = queryString + dateClause;

		queryString = queryString + "\nLIMIT 100;";

		pgquery.query(queryString, sqlparams, function(err, result){
			if (err) {
				console.log('Error getting discover:');
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				console.log('Success getting discover!');
				return res.send(result.rows);
			}
		});
	});

router.route('/posts/user/:userid')
	.get(function(req, res) {
		var additionalQuery = "WHERE Posts.fk_userid=$1";
		var sqlparams = [req.params.userid];

		if (req.query.fromDate != null) {
			additionalQuery = additionalQuery + " " + dateClauseGreaterThanWithParamNum(2);
			sqlparams.push(new Date(req.query.fromDate));
		}

		var queryString = postQuery(additionalQuery);

		pgquery.query(queryString, sqlparams, function(err, result){
			if (err) {
				console.log('Error getting user posts');
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				console.log('Success getting user posts!');
				return res.send(result.rows);
			}
		});
	});

router.route('/posts/following/:userid')
	.get(function(req, res) {
		var additionalQuery = "INNER JOIN Followers ON Followers.fk_followinguserid=Users.pk_userid\n" + 
						"WHERE Followers.fk_followeruserid = $1";
		var sqlparams = [req.params.userid];

		if (req.query.fromDate != null) {
			additionalQuery = additionalQuery + " " + dateClauseGreaterThanWithParamNum(2);
			sqlparams.push(new Date(req.query.fromDate));
		}

		var queryString = postQuery(additionalQuery);

		pgquery.query(queryString, sqlparams, function(err, result){
			if (err) {
				console.log('Error getting following:');
				console.log(err);
				return res.status(500).send(err);
			}
			else {
				console.log('Success getting following!');
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
		"COALESCE (\n" +
		"json_agg((SELECT r FROM (SELECT Reactions.pk_reactionid, Reactions.reaction) r))\n" +
		"FILTER (WHERE Reactions.pk_reactionid IS NOT NULL), '[]') as reactions\n" +
		"FROM Posts\n" +
		"LEFT JOIN Reactions ON Posts.pk_postid = Reactions.fk_postid\n" +
		"INNER JOIN Users ON Posts.fk_userid = Users.pk_userid\n";
}

function postGrouping() {
	return "GROUP BY Posts.pk_postid, Users.pk_userid, Users.username\n" +
		"ORDER BY Posts.created DESC\n" + 
		"LIMIT 100";
}

function dateClauseGreaterThanWithParamNum(paramNum) {
	if (paramNum > 1) {
		return "AND Posts.created < $" + paramNum;
	}
	else {
		return "WHERE Posts.created < $" + paramNum;
	}
}

module.exports = router;