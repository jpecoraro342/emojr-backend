/* User Queries */

INSERT INTO Users (username, userfullname, password, salt) 
VALUES ('testuser', 'user actual name', 'pass', 'salt')
RETURNING Users.pk_userid, Users.username, Users.userfullname;

-- select all Users
SELECT Users.pk_userid, Users.username, Users.userfullname FROM Users;

/* Post Queries */

-- Get All Posts
SELECT Users.pk_userid, Users.username, Posts.pk_postid, Posts.post, Posts.created, Posts.lastmodified,
	COALESCE(
		json_agg((SELECT r FROM (SELECT Reactions.pk_reactionid, Reactions.reaction) r))
		FILTER (WHERE Reactions.pk_reactionid IS NOT NULL), '[]') as reactions
FROM Posts
LEFT JOIN Reactions ON Posts.pk_postid = Reactions.fk_postid
INNER JOIN Users ON Posts.fk_userid = Users.pk_userid
GROUP BY Posts.pk_postid, Users.pk_userid, Users.username;

-- Get post id
SELECT Users.pk_userid, Users.username, Posts.pk_postid, Posts.post, Posts.created, Posts.lastmodified,
	json_agg((SELECT r FROM (SELECT Reactions.pk_reactionid, Reactions.reaction) r)) as reactions
FROM Posts
INNER JOIN Reactions ON Posts.pk_postid = Reactions.fk_postid
INNER JOIN Users ON Posts.fk_userid = Users.pk_userid
WHERE Posts.pk_postid=2
GROUP BY Posts.pk_postid, Users.pk_userid, Users.username;


SELECT Users.pk_userid, Users.username, Users.userfullname 
FROM Followers
INNER JOIN Users
ON Followers.fk_followinguserid=Users.pk_userid
WHERE Followers.fk_followeruserid=$1;


SELECT Users.pk_userid, Users.username, Posts.pk_postid, Posts.post, Posts.created, Posts.lastmodified,
json_agg((SELECT r FROM (SELECT Reactions.pk_reactionid, Reactions.reaction) r)) as reactions
FROM Posts
INNER JOIN Reactions ON Posts.pk_postid = Reactions.fk_postid
INNER JOIN Users ON Posts.fk_userid = Users.pk_userid
INNER JOIN Followers ON Followers.fk_followinguserid=Users.pk_userid
WHERE Followers.fk_followeruserid = 9
GROUP BY Posts.pk_postid, Users.pk_userid, Users.username;


SELECT Users.pk_userid, Users.username, Users.userfullname
FROM Followers
INNER JOIN Users
ON Followers.fk_followinguserid=Users.pk_userid\n
WHERE Followers.fk_followeruserid=2

DELETE FROM Followers
WHERE Followers.fk_followeruserid=1 AND Followers.fk_followinguserid=2;

SELECT Users.username
FROM Users
Where Users.username LIKE '' || 💩 || '%'
LIMIT 100;