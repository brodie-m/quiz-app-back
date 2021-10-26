const mongoose = require('mongoose');

const roomsSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    participants: {
        type: Array,
    }
})

module.exports = mongoose.model('Room',roomsSchema)