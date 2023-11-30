const socket = io();

// listen for welcome message upon joining the chat room
socket.on("welcome", message => {
   console.log(message);
});

// listen for user joined message to send to all other users
socket.on("user joined", message => {
   console.log(message);
});