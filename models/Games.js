const mongoose = require('mongoose');

const gamesSchema = new mongoose.Schema({
    games: {
        type: Array
    }
})

module.exports = mongoose.model('Games',gamesSchema)