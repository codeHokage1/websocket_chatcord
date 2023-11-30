const path = require('path');
const express = require('express');
const socket = require('socket.io');

const app = express();
const server = require('http').createServer(app);
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'public')));

const io = socket(server);
io.on("connection", socket => {
   console.log("New client connected. Socekt details");

   // welcome the connected user
   socket.emit("welcome", "Welcome to the chat room");

   // send a message to all users except the newly connected user
   socket.broadcast.emit("user joined", "A new user has joined the chat room");


})

server.listen(process.env.PORT || 3000, () => {
   console.log('Server listening at port:', process.env.PORT);
})
