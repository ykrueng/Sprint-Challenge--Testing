const express = require('express');

server = express();
server.use(express.json());

module.exports = server;