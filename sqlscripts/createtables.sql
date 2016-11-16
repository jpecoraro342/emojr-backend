-- DROP TABLE IF EXISTS Users;

CREATE TABLE IF NOT EXISTS Users (
  pk_UserId SERIAL PRIMARY KEY NOT NULL,
  UserName VARCHAR(30) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,
  Salt VARCHAR(255) NOT NULL,
  Email VARCHAR(60),
  Created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  LastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DROP TABLE IF EXISTS Posts;

CREATE TABLE IF NOT EXISTS Posts (
  pk_PostId SERIAL PRIMARY KEY NOT NULL,
  fk_UserId INTEGER REFERENCES Users(pk_UserId) NOT NULL,
  Post VARCHAR(30),
  Created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  LastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DROP TABLE IF EXISTS Reactions;

CREATE TABLE IF NOT EXISTS Reactions (
  pk_ReactionId SERIAL PRIMARY KEY NOT NULL,
  fk_UserId INTEGER REFERENCES Users(pk_UserId) NOT NULL,
  fk_PostId INTEGER REFERENCES Posts(pk_PostId) NOT NULL,
  Reaction VARCHAR(30),
  Created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  LastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DROP TABLE IF EXISTS Roles;

CREATE TABLE IF NOT EXISTS Roles (
  pk_RoleId SERIAL PRIMARY KEY NOT NULL,
  Role VARCHAR(30),
  Created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  LastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DROP TABLE IF EXISTS Followers;

CREATE TABLE IF NOT EXISTS Followers (
  fk_FollowerUserId INTEGER REFERENCES Users(pk_UserId) NOT NULL,
  fk_FollowingUserId INTEGER REFERENCES Users(pk_UserId) NOT NULL,
  Created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  LastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DROP TABLE IF EXISTS UserRoles;

CREATE TABLE IF NOT EXISTS UserRoles (
  fk_UserId INTEGER REFERENCES Users(pk_UserId) NOT NULL,
  fk_RoleId INTEGER REFERENCES Roles(pk_RoleId) NOT NULL,
  Created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  LastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE VIEW vw_PostsAggregate AS 
SELECT Users.pk_userid, Users.username, Posts.pk_postid, Posts.post, Posts.created, Posts.lastmodified,
  COALESCE(
    json_agg((SELECT r FROM (SELECT Reactions.pk_reactionid, Reactions.reaction) r))
    FILTER (WHERE Reactions.pk_reactionid IS NOT NULL), '[]') as reactions
FROM Posts
LEFT JOIN Reactions ON Posts.pk_postid = Reactions.fk_postid
INNER JOIN Users ON Posts.fk_userid = Users.pk_userid
GROUP BY Posts.pk_postid, Users.pk_userid, Users.username;

CREATE VIEW vw_DiscoverPosts AS
SELECT * FROM vw_PostsAggregate
ORDER BY created DESC;

/*
CREATE OR REPLACE FUNCTION update_modified_column()	
RETURNS TRIGGER AS $$
BEGIN
    NEW.LastModified = now();
    RETURN NEW;	
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();
*/