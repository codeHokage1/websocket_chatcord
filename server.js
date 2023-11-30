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
		socket.emit("welcome", formatMessage("Admin", "Welcome to the chat room"));

		// send a message to all users except the newly connected user
		socket.broadcast
			.to(user.room)
			.emit("user joined", formatMessage("Admin", `${user.username} has joined the chat room`));

		// display room detials to the connected client
		io.to(user.room).emit("display room info", {
			room: user.room,
			users: userFunctions.getRoomUsers(user.room)
		});
	});

	// listen for chat message from client
	socket.on("chat message", (message) => {
		console.log("New message: ", message);

		// get current user
		const user = userFunctions.getCurrentUser(socket.id);
		if (!user) return;

		io.to(user.room).emit("chat message", formatMessage(user.username, message)); // send message to all users plus the sender
	});

	// listen for disconnect
	socket.on("disconnect", () => {
		console.log("User disconnected");

		// get current user
		const user = userFunctions.userLeave(socket.id);

		if(!user) return;

		io.to(user.room).emit(
			"user left",
			formatMessage("Admin", `${user.username} has left the chat room`)
		);

		// display room detials to the connected client
		io.to(user.room).emit("display room info", {
			room: user.room,
			users: userFunctions.getRoomUsers(user.room)
		});
	});
});

server.listen(process.env.PORT || 3000, () => {
	console.log("Server listening at port:", process.env.PORT);
});
