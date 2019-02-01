const express = require('express');

server = express();
server.use(express.json());

const games = [];
const emptyGames = () => games.length = 0;

server
  .post('/games', (req, res) => {
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
      const duplicateTitle = games.find(game => game.title === title);

      if (duplicateTitle) {
        res.sendStatus(405);
      } else {
        games.push({ title, genre, releaseYear });
        res.status(201).json({ id: games.length });
      }
    }
  })
  .get('/games', (req, res) => {
    res.status(200).json({ games: games });
  })


module.exports = {
  server,
  emptyGames
};