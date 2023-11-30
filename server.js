const path = require("path");
const express = require("express");
const socket = require("socket.io");

const app = express();
const server = require("http").createServer(app);
require("dotenv").config();

const { formatMessage } = require("./utils/messages");
const userFunctions = require("./utils/users");

app.use(express.static(path.join(__dirname, "public")));

const io = socket(server);
io.on("connection", (socket) => {
	console.log("New client connected.");

	// listen for join room event from client
	socket.on("join room", ({ currentUser, currentRoom }) => {
		console.log(`${currentUser} has joined the chat room ${currentRoom}`);

      // join the room
      const user = userFunctions.userJoin(socket.id, currentUser, currentRoom);
      socket.join(user.room);
      
		// welcome the connected user
		socket.to(user.room).emit("welcome", formatMessage("Admin", "Welcome to the chat room"));

		// send a message to all users except the newly connected user
		socket.broadcast.to(user.room).emit("user joined", `${user.username} has joined the chat room`);
	});

	// listen for chat message from client
	socket.on("chat message", (message) => {
		console.log("New message: ", message);

      // get current user
      const user = userFunctions.getCurrentUser(socket.id);
		io.emit("chat message", formatMessage()); // send message to all users plus the sender
	});

	// listen for disconnect
	socket.on("disconnect", () => {
		console.log("User disconnected");
		io.emit("user left", "A user has left the chat room");
	});
});

server.listen(process.env.PORT || 3000, () => {
	console.log("Server listening at port:", process.env.PORT);
});
