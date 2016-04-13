var User = require('../models/user');
var express = require('express');
var pgquery = require('../pgquery');
var router = express.Router();

router.route('/following/:userid')
	.get(function(req, res) {
		var queryString = "SELECT Users.pk_userid, Users.username, Users.userfullname\n" +  
                        "FROM Followers\n" + 
                        "INNER JOIN Users\n" + 
                        "ON Followers.fk_followinguserid=Users.pk_userid\n" +
                        "WHERE Followers.fk_followeruserid=$1";

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

router.route('/followers/:userid')
	.get(function(req, res) {
		var queryString = "SELECT Users.pk_userid, Users.username, Users.userfullname\n" +  
                        "FROM Followers\n" + 
                        "INNER JOIN Users\n" + 
                        "ON Followers.fk_followeruserid=Users.pk_userid\n" +
                        "WHERE Followers.fk_followinguserid=$1";

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

router.route('/follow')
    .get(function(req, res) {
        var queryString = "SELECT * FROM Followers;";

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
	.post(function(req, res) {
        var queryString = "INSERT INTO Followers (fk_followeruserid, fk_followinguserid)\n" + 
                        "VALUES ($1, $2)\n" + 
                        "RETURNING Followers.fk_followeruserid, Followers.fk_followinguserid;";
        
        pgquery.query(queryString, [req.body.followerUserId, req.body.followingUserId], function(err, result){
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            else {
                return res.send(result.rows[0]);
            }
        });
	})
    .delete(function(req, res) {
        console.log(req.body);

        var queryString = "DELETE FROM Followers\n" +  
                        "WHERE Followers.fk_followeruserid=$1 AND Followers.fk_followinguserid=$2;";

        pgquery.query(queryString, [req.body.followerUserId, req.body.followingUserId], function(err, result){
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            else {
                return res.send(result.rows[0]);
            }
        });
    })

module.exports = router;