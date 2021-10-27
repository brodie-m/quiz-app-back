const path = require('path')
const http = require('http');
const express = require('express')
const mongoose = require('mongoose')
const Room = require('./models/Room')
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
io.on('connection',async (socket)=> {
    
    console.log('new websocket connection')
    

    console.log(socket.rooms)
    socket.on('connect_error', (err) => {
        console.log(`connect_error due to ${err.message}`)
    })
    socket.on('create-room', (room) => {
        const newRoom = new Room({
            name: room,
            participants: [`${socket.id}`]
        })
        newRoom.save();
        socket.join(room)
    })

    socket.on('join-room', async (room) => {
        try {
            const foundRoom = await Room.findOne({name: room})
        if (!foundRoom.participants.includes(socket.id)){
        foundRoom.participants = [...foundRoom.participants, `${socket.id}`]
        console.log(`${socket.id} joined room ${room}`)}
        const participants = foundRoom.participants
        await foundRoom.save()
        
        socket.join(room)
        socket.emit('display-messages',{room: room, messages: messages[room], participants: participants })
        // socket.to(room).emit('display-messages',{room: room, messages: messages[room] })
        }
        catch (err) {
            console.log(err)
        }
        
        
    })
    socket.on('send-message', payload => {
        console.log('send-message event received')
        if (!messages[payload.room]) {messages[payload.room] =[]}
        messages[payload.room].push({username: payload.username, message : payload.message, timestamp: payload.timestamp})
        console.log('message is',payload.message, 'sent to',payload.room)
        socket.to(payload.room).emit('display-messages', {room: payload.room, messages: messages[payload.room], participants: payload.participants})
        socket.emit('display-messages', {room: payload.room, messages: messages[payload.room], participants: payload.participants})
    })
    
    socket.on('start-game', payload => {
    
        
        console.log('start game received')
        console.log('payload is', payload)
        //receive start-game from room creator, send questions to others in room
        socket.to(payload.room).emit('game-start', payload.questions)
        socket.emit('game-start', payload.questions)
        
    })

    socket.on('disconnect', async () => {
        const foundRooms = await Room.find({participants: `${socket.id}`})
        foundRooms.forEach(room => {
            room.participants.pull(`${socket.id}`)
            console.log('removing', socket.id, 'from room', room)
            room.save()
        })
        
        console.log('disconnecting')
        
    })
})


server.listen(PORT, () => console.log(`We are live on port ${PORT}`))