const path = require('path')
const http = require('http');
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./server');
const socketio = require('socket.io');

const server = http.createServer(app)
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

//static folder for client
app.use(express.static(path.join(__dirname,'public')))

//connect to db
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true
}, () => {
    console.log('connected to db')
})

//run when client connects
io.on('connection', socket=> {
    console.log('new websocket connection')
})


server.listen(PORT, () => console.log(`We are live on port ${PORT}`))