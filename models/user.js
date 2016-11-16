'use strict';

let crypto = require('crypto');
let validator = require('validator');

function User(attributes) {
    this.pk_userid = attributes.pk_userid;
    this.username = attributes.username;
    this.password = attributes.password;
    this.salt = attributes.salt;
    this.email = attributes.email;
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