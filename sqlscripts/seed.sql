/* User Queries */

INSERT INTO Users (username, userfullname, password, salt) 
VALUES ('testuser', 'user actual name', 'pass', 'salt')
RETURNING Users.pk_userid, Users.username, Users.userfullname;

-- select all Users
SELECT Users.pk_userid, Users.username, Users.userfullname FROM Users;

-- Get All Posts
SELECT Users.pk_userid, Users.username, Posts.pk_postid, Posts.post, Posts.created, Posts.lastmodified,
json_agg((SELECT r FROM (SELECT Reactions.pk_reactionid, Reactions.reaction) r)) as reactions
FROM Posts
INNER JOIN Reactions ON Posts.pk_postid = Reactions.fk_postid
INNER JOIN Users ON Posts.fk_userid = Users.pk_userid
GROUP BY Posts.pk_postid, Users.pk_userid, Users.username;