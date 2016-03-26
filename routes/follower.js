var User = require('../models/user');
var express = require('express');
var _ = require('lodash');
var router = express.Router();

router.route('/followers/:userid')
	.get(function(req, res) {
		User.findById(req.params.userid)
        .populate('following', '-password -salt')
        .exec(function (err, user) {
            if (err) {
                return res.send(err);
            }
            if (user) {
                return res.send(user.following);
            }
            
           	res.status(403).send({ message : "user not found" });
            
        });
	})

router.route('/follow')
	.post(function(req, res) {
		User.findById(req.body.userid, function(err, user) {
            if (err) {
                return res.send(err);
            }
            if (user) {
            	if (_.includes(user.following, req.body.followUserId)) {
            		return res.send( { success: false, message: "already following user"});
            	}
            	else {
					user.following.push(req.body.followUserId);

	                user.save(function(err) {
						if (err) {
							return res.send(err);
						}

						User.findById(req.body.followUserId, function (err, followUser) {
							if (_.includes(followUser.followers, req.body.userid)) {
			            		return res.send( { success: false, message: "user already has you in their followers list"});
			            	}
			            	else {
								followUser.followers.push(req.body.userid);

				                followUser.save(function(err) {
									if (err) {
										return res.send(err);
									}

									return res.send( { following: user.following, followers: followUser.followers });
								});
			            	}
						});
					});
            	}
            } else {
            	res.send( { success: false, message: "user not found"});
            }
        });
	})

module.exports = router;