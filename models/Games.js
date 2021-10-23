const mongoose = require('mongoose');

const gamesSchema = new mongoose.Schema({
    games: {
        type: Array,
        default: [],
    }
})

module.exports = mongoose.model('Games',gamesSchema)