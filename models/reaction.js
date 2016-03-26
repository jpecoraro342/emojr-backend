'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;


/**
 * Reaction Schema
 */
var ReactionSchema = new Schema({
    username: {
        type: String
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    reaction: {
        type: String
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reaction', ReactionSchema);