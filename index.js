const path = require('path')
const http = require('http');
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./server');
const socketio = require('socket.io');
const cors = require('cors')
const server = http.createServer(app)
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: [],
        credentials: true
    }
});

const PORT =  process.env.PORT  || 3001;


//cors
app.use(cors({
    credentials: true,
    origin: true
}));

//connect to db
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true
}, () => {
    console.log('connected to db')
})
let users = []
let messages = {}
//run when client connects
io.on('connection', socket=> {
    console.log('new websocket connection')
    console.log(socket.rooms)
    socket.on('connect_error', (err) => {
        console.log(`connect_error due to ${err.message}`)
    })
    socket.on('join-room', (room) => {
        console.log(`${socket.id} joined room ${room}`)
        console.log(socket.rooms)
    })
    socket.on('send-message', payload => {
        console.log('send-message event received')
        if (!messages[payload.room]) {messages[payload.room] =[]}
        messages[payload.room].push(payload.message)
        console.log('message is',payload.message, 'sent to',payload.room)
        socket.emit('display-messages', {room: payload.room, messages: messages[payload.room]})
    })
    
    socket.on('disconnect', () => {
        console.log('disconnecting')
        
    })
})


server.listen(PORT, () => console.log(`We are live on port ${PORT}`))