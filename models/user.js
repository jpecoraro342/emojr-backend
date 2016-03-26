'use strict';

let crypto = require('crypto');
let validator = require('validator');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


/**
 * User Schema
 */
var UserSchema = new Schema({
    username: {
        type: String,
        unique: 'Username already exists',
        required: 'Please fill in a username',
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        default: ''
    },
    following: {
        type: [{
            type: String
        }]
    },
    salt: {
        type: String
    },
    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin']
        }],
        default: ['user'],
        required: 'Please provide at least one role'
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
    if (this.password && this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

module.exports = mongoose.model('User', UserSchema);