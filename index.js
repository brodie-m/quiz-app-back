const path = require('path')
const http = require('http');
const { application } = require('express');
const express = require('express')

const app = express()
const server = http.createServer(app)
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

//static folder for client
app.use(express.static(path.join(__dirname,'public')))

//run when client connects
io.on('connection', socket=> {
    console.log('new websocket connection')
})


server.listen(PORT, () => console.log(`We are live on port ${PORT}`))