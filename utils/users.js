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
   const foundUserIndex = users.findIndex(user => user.id === id);
   if(foundUserIndex !== -1){
      return users.splice(foundUserIndex, 1)[0]
   }
}

// Get room users
exports.getRoomUsers = (room) => {
   return users.filter(user => user.room === room);
}