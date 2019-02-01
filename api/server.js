const express = require('express');

server = express();
server.use(express.json());

server.post('/games', (req, res) => {
  const { title, genre, releaseYear } = req.body;

  if (!title || !genre) {
    res.sendStatus(422);
  } else if (
    typeof title !== 'string' ||
    typeof genre !== 'string'
  ) {
    res.sendStatus(400);
  } else if (releaseYear && typeof releaseYear === 'string') {
    res.sendStatus(400);
  } else {
    res.status(201).json({ id: 1 });
  }
})

module.exports = server;