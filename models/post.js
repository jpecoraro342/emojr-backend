'use strict';

function Post(attributes) {
    this.pk_postid = attributes.pk_postid;
    this.fk_userid = attributes.fk_userid;
    this.post = attributes.post;

    if (this.fk_userid == null) {
        this.fk_userid = attributes.userid;
    }
}

module.exports = Post;