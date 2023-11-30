const users = [];

// Join room
exports.userJoin = (id, username, room) => {
   const user = { id, username, room };
   users.push(user);
   return user;
}

// Get current user
exports.getCurrentUser = (id) => {
   return users.find(user => user.id === id);
}

// User leaves chat
exports.userLeave = (id) => {
   return users.filter(user => user.id !== id);
}