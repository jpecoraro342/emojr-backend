'use strict';

let crypto = require('crypto');
let validator = require('validator');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


function User(json) {
    var _this = this;

    this.pk_userid = json.pk_userid;
    this.username = json.username;
    this.userfullname = json.fullname;
    this.password = json.password;
    this.salt = json.salt;
    this.email = json.email;

    if (this.userfullname == null) {
        this.userfullname = json.fullname;
    }
}

User.prototype.presave = function() {
    if (this.password) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }
}

/**
 * Create instance method for hashing a password
 */
User.prototype.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
User.prototype.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

module.exports = User;