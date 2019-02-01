const express = require('express');

server = express();
server.use(express.json());

let games = [];
const emptyGames = () => games.length = 0;
const counter = (() => {
  let id = 1;
  return () => id++;
})();

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
        const id = counter();
        games.push({ id, title, genre, releaseYear });
        res.status(201).json({ id });
      }
    }
  })
  .get('/games', (req, res) => {
    res.status(200).json({ games: games });
  })
  .get('/games/:id', (req, res) => {
    const { id } = req.params;

    const game = games.find(game => game.id === Number(id));

    if (!game) {
      res.sendStatus(405);
    } else {
      res.status(200).json({ game });
    }
  })
  .delete('/games/:id', (req, res) => {
    const { id } = req.params;

    const game = games.find(game => game.id === Number(id));

    if (!game) {
      res.sendStatus(405);
    } else {
      games = games.filter(game => game.id !== Number(id));
      res.sendStatus(204);
    }
  })


module.exports = {
  server,
  emptyGames
};