'use strict';

function Post(json) {
    this.pk_postid = json.pk_postid;
    this.fk_userid = json.fk_userid;
    this.post = json.post;

    if (this.fk_userid == null) {
        this.fk_userid = json.userid;
    }
}

module.exports = Post;