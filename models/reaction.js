'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;


/**
 * Reaction Schema
 */
var ReactionSchema = new Schema({
    user: {
        type: String,
    },
    reaction: {
        type: String,
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