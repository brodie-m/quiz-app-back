const mongoose = require('mongoose');

const gamesSchema = new mongoose.Schema({
    participants: {
        type: Array,
        required: true,
    },
    questions: {
        type: Array,
        required: true,
    }
})

module.exports = mongoose.model('Game',gamesSchema)