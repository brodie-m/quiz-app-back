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
const messages = {
    general: [],
    random: [],
    jokes: [],
    javascript: []    
}
//run when client connects
io.on('connection', socket=> {
    console.log('new websocket connection')
    socket.on('connect_error', (err) => {
        console.log(`connect_error due to ${err.message}`)
    })
    socket.on('join-server', (username) => {
        console.log('joining server')
        const user = {
            username,
            id: socket.id
        }
        users.push(user);
        io.emit('new-user',users)
    })

    socket.on('join-room',(roomName, cb) => {
        console.log('joining room')
        socket.join(roomName);
        cb(messages[roomName]);
    })

    socket.on('send-message', ({content, to, sender, chatName, isChannel}) => {
        if (isChannel) {
            const payload = {
                content,
                chatName,
                sender,
            };
            socket.to(to).emit('new-message', payload);
        } else {
            const payload = {
                content,
                chatName: sender,
                sender
            }
            socket.to(to).emit('new-message', payload)
        }
        if (messages[chatName]) { 
            messages[chatName].push({
                sender,
                content
            });
        }

    });
    socket.on('disconnect', () => {
        console.log('disconnecting')
        users = users.filter(u => u.id !== socket.id);
        io.emit('new-user',users)
    })
})


server.listen(PORT, () => console.log(`We are live on port ${PORT}`))