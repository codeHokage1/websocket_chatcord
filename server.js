const path = require('path');
const express = require('express');

const app = express();
const server = require('http').createServer(app);
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'public')));

server.listen(process.env.PORT || 3000, () => {
   console.log('Server listening at port:', process.env.PORT);
})
