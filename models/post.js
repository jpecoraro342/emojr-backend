'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;


/**
 * Post Schema
 */
var PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: String
    },
    reactions: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Reaction'
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