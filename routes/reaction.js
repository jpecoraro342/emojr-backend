var Reaction = require('../models/reaction');
var Post = require('../models/post');
var User = require('../models/user');
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

router.route('/reactions')
	.get(function(req, res) {
		Reaction.find({})
		.exec(function(err, reactions) {
			if (err) {
				return res.send(err);
			}

			res.send(reactions);
		});
	})

router.route('/reaction')
	.post(function(req, res) {
		Post.findById(req.body.post)
		.exec(function(err, post) {
			if (err) {
				return res.send(err);
			}

			if (post) {
				var reaction = new Reaction(req.body);

	    		reaction.save(function(err) {
					if (err) {
						return res.send(err);
					}

					post.reactions.push(reaction._id);
					post.save(function(err) {
						if (err) {
							return res.send(err);
						}

						res.send(reaction);
					});
				});
			}
			else {
				res.status(403).send({ message : "post not found" });
			}

		});
	});

router.route('/reaction/:reactionid')
	.get(function(req, res) {
		Reaction.findById(req.params.reactionid)
		.exec(function(err, reaction) {
			if (err) {
				return res.send(err);
			}

			res.send(reaction);
		});
	})

router.route('/reactions/user/:username')
	.get(function(req, res) {
		Reaction.find({})
		.where('user').equals(req.params.username)
		.exec(function(err, reaction) {
			if (err) {
				return res.send(err);
			}

			res.send(reaction);
		});
	})


module.exports = router;