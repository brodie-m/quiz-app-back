const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
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

})

module.exports = mongoose.model('Stats',statsSchema)