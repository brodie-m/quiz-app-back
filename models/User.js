const mongoose = require('mongoose');
const statsSchema = require('./Stats').schema;
const gamesSchema = require('./Games').schema;

//importing stats and games schemas to make user schema more concise

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    // games: [gamesSchema],
    games: {
        type: Array,
        required: true,
        default: ['test'],
    },
    // stats: [statsSchema],
    stats: {
        xp: {
            type: Number,
            required: true,
            default: 0,
        },
        level: {
            type: Number,
            required: true,
            default: 1,
        },
        numGames: {
            type: Number,
            required: true,
            default: 0,
        },
        numWins: {
            type: Number,
            required: true,
            default: 0,
        }
    },
    friends: {
        type: Array,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }


},{timestamps: false});

module.exports = mongoose.model('User',userSchema)