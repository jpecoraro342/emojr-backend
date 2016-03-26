'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;


/**
 * Post Schema
 */
var PostSchema = new Schema({
    userId: {
        type: String,
    },
    post: {
        type: String,
    },
    reactions: {
        type: [{
            type: String
        }]
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema);