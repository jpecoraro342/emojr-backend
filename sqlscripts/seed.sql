/* User Queries */

INSERT INTO Users (username, userfullname, password, salt) 
VALUES ('testuser', 'user actual name', 'pass', 'salt')
RETURNING Users.pk_userid, Users.username, Users.userfullname;

-- select all Users
SELECT Users.pk_userid, Users.username, Users.userfullname FROM Users;