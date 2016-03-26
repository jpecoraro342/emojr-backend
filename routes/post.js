var Post = require('../models/post');
var User = require('../models/user');
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

// TODO: populate the reactions

router.route('/posts')
	.get(function(req, res) {
		Post.find({})
		.populate('user', 'username fullname')
		.exec(function(err, posts) {
			if (err) {
				return res.send(err);
			}

			res.send(posts);
		});
	})

router.route('/post')
	.post(function(req, res) {
		var post = new Post(req.body);

		post.save(function(err) {
			if (err) {
				return res.send(err);
			}

			res.send(post);
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