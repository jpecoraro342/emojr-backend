var Post = require('../models/post');
var User = require('../models/user');
var express = require('express');
var router = express.Router();

router.route('/posts')
	.get(function(req, res) {
		Post.find({})
		.exec(function(err, posts) {
			if (err) {
				return res.send(err);
			}

			res.send(posts);
		});
	})
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
		.exec(function(err, post) {
			if (err) {
				return res.send(err);
			}

			res.send(post);
		});
	})

router.route('/posts/user/:userid')
	.get(function(req, res) {
		Post.find({userId: req.params.userid})
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
                .where('userId').in(user.following)
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