var Post = require('../models/post');
var Reaction = require('../models/reaction');
var User = require('../models/user');
var pgquery = require('../pgquery');
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

router.route('/posts')
	.get(function(req, res) {
		/* var queryString = "SELECT Users.pk_userid, Users.username, Posts.pk_postid, Posts.post, Reactions.pk_reactionid, Reactions.reaction\n" + 
						"FROM Posts\n" + 
						"INNER JOIN Reactions\n" + 
						"ON Posts.pk_postid = Reactions.fk_postid\n" + 
						"INNER JOIN Users\n" + 
						"ON Posts.fk_userid = Users.pk_userid;"; */

		var queryString = "SELECT Users.pk_userid, Users.username, Posts.pk_postid, Posts.post, Posts.created, Posts.lastmodified,\n" +
						"json_agg((SELECT r FROM (SELECT Reactions.pk_reactionid, Reactions.reaction) r)) as reactions\n" +
						"FROM Posts\n" +
						"INNER JOIN Reactions ON Posts.pk_postid = Reactions.fk_postid\n" +
						"INNER JOIN Users ON Posts.fk_userid = Users.pk_userid\n" +
						"GROUP BY Posts.pk_postid, Users.pk_userid, Users.username;"

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
	})

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
		Post.findById(req.params.postid)
		.populate('user', 'username fullname')
		.exec(function(err, post) {
			if (err) {
				return res.send(err);
			}

			res.send(post);
		});
	})

router.route('/posts/user/:userid')
	.get(function(req, res) {
		Post.find({})
		.where('user').equals(mongoose.Types.ObjectId(req.params.userid))
        .populate('reactions', 'username reaction created')
		.populate('user', 'username fullname')
		.exec(function(err, post) {
			if (err) {
				return res.send(err);
			}

			res.send(post);
		});
	})

router.route('/posts/following/:userid')
	.get(function(req, res) {
		User.findById(req.params.userid)
        .exec(function (err, user) {
            if (err) {
                return res.send(err);
            }
            if (user) {
                Post.find()
                .where('user').in(user.following)
                .populate('reactions', 'username reaction created')
                .populate('user', 'username fullname')
				.exec(function(err, posts) {
					if (err) {
						return res.send(err);
					}

					res.send(posts);
				});
            }
            else {
            	res.status(403).send({ message : "user not found" });
            }
        });
	})


module.exports = router;