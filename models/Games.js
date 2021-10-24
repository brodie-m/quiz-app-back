const mongoose = require('mongoose');

const gamesSchema = new mongoose.Schema({
    games: {
        type: Array,
        required: true,
        default: ['test'],
    }
})

module.exports = mongoose.model('Games',gamesSchema)