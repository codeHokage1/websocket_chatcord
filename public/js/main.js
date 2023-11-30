const socket = io();
const chatMessages = document.querySelector(".chat-messages");
const chatForm = document.getElementById("chat-form");

const currentURL = window.location.href;
const queryParams = new URLSearchParams(currentURL.split("?")[1]);
const currentUser = queryParams.get("username");
const currentRoom = queryParams.get("room");

// emit join room event to server
socket.emit("join room", { currentUser, currentRoom });

// listen for welcome message upon joining the chat room
socket.on("welcome", (payload) => {
	console.log(payload.message);
   displayMessage(payload);
   autoScroll();
});

// listen for user joined message to send to all other users
socket.on("user joined", (message) => {
	console.log(message);
   displayMessage("Admin", message);
   autoScroll();
});

// emit message to server when user sends a chat
chatForm.addEventListener("submit", (e) => {
   e.preventDefault();
   const message = e.target.elements.msg.value;
   socket.emit("chat message", message); // send message to server
   e.target.elements.msg.value = "";
   e.target.elements.msg.focus();
});

// listen for chat message from the server
socket.on("chat message", message => {
   console.log("New message: ", message)
   displayMessage(currentUser, message)
   autoScroll();
})

// listen for user left message to send to all other users
socket.on("user left", (message) => {
   console.log(message);
   displayMessage("Admin", message);
   autoScroll();
});

 

// function to display messages on DOM
function displayMessage(payload) {
	const div = document.createElement("div");
	div.classList.add("message");
	div.innerHTML = `
      <p class="meta">${payload.user} <span>${payload.time}</span></p>
      <p class="text">
         ${payload.message}
      </p>
   `;
	chatMessages.appendChild(div);
}

// Add auto scroll effect for chat messages
function autoScroll() {
   chatMessages.scrollTop = chatMessages.scrollHeight;
}
