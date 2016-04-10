'use strict';

function Reaction(attributes) {
    this.pk_reactionid = attributes.pk_reactionid;
    this.fk_userid = attributes.fk_userid;
    this.fk_postid = attributes.fk_postid;
    this.reaction = attributes.reaction;

    if (this.fk_userid == null) {
        this.fk_userid = attributes.userid;
    }

    if (this.fk_postid == null) {
        this.fk_postid = attributes.postid;
    }
}

module.exports = Reaction;