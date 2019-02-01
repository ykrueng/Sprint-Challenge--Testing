const request = require('supertest');

const { server, emptyGames } = require('./server.js');

afterEach(emptyGames);

describe('server.js', () => {
  describe('POST /games', () => {
    it('should return 422 if title or genre is not in request body', async() => {
      let response = await request(server).post('/games').send({});
      expect(response.status).toBe(422);

      response = await request(server).post('/games').send({ title: 'Pacman' });
      expect(response.status).toBe(422);

      response = await request(server).post('/games').send({
        genre: 'Arcade',
      });
      expect(response.status).toBe(422);
    });

    it('should return 400 if title, genre, or releaseYear is in the wrong type', async () => {
      const body = {
        title: 'Pacman',
        genre: 'Arcade'
      }

      let response = await request(server).post('/games').send({...body, title: 1998});
      expect(response.status).toBe(400);

      response = await request(server).post('/games').send({ ...body, genre: [] });
      expect(response.status).toBe(400);

      response = await request(server).post('/games').send({
        ...body, releaseYear: 'Arcade'
      });
      expect(response.status).toBe(400);
    });

    it('should return 201 if a correct game data is sent', async () => {
      const body = {
        title: 'Pacman',
        genre: 'Arcade'
      }

      let response = await request(server).post('/games').send(body);
      expect(response.status).toBe(201);

      response = await request(server).post('/games').send({ ...body, releaseYear: 1980, title: 'Pacman 2' });
      expect(response.status).toBe(201);
    })
    
    it('should return 405 if the title has been used', async () => {
      const body = {
        title: 'Pacman',
        genre: 'Arcade',
        releaseYear: 1998,
      }

      let response = await request(server).post('/games').send(body);
      response = await request(server).post('/games').send({ ...body, releaseYear: 1980 });

      expect(response.status).toBe(405);
    })
  });

  describe('GET /games', () => {
    it('should return status code 200', async () => {
      let response = await request(server).get('/games');
      expect(response.status).toBe(200);
    });
    it('should response with JSON', async () => {
      let response = await request(server).get('/games');
      expect(response.type).toMatch(/json/i);
    });
    it('should send back an empty array or an array with game object', async () => {
      let response = await request(server).get('/games');
      expect(response.body.games).toEqual([]);

      const body = {
        title: 'Pacman',
        genre: 'Arcade',
        releaseYear: 1998
      }

      const postResponse = await request(server).post('/games').send(body);
      const id = postResponse.body.id;

      response = await request(server).get('/games');
      expect(response.body.games.length).toBe(1);
      expect(response.body.games).toEqual([{ ...body, id }]);
    });
  });

  describe('GET /games/id', () => {
    it('should return status code 404 if game is not found', async () => {
      let response = await request(server).get('/games/1');
      expect(response.status).toBe(405);
    });
    it('should return status code 200 if game is found', async () => {
      const body = {
        title: 'Pacman',
        genre: 'Arcade',
        releaseYear: 1998
      }

      const postResponse = await request(server).post('/games').send(body);
      const id = postResponse.body.id;
      const response = await request(server).get(`/games/${id}`);
      expect(response.status).toBe(200);
    });
    it('should response with JSON', async () => {
      const body = {
        title: 'Pacman',
        genre: 'Arcade',
        releaseYear: 1998
      }

      const postResponse = await request(server).post('/games').send(body);
      const id = postResponse.body.id;
      const response = await request(server).get(`/games/${id}`);
      expect(response.body.game).toEqual({...body, id});
    });
    it('should send a game when it is found', async () => {
      const body = {
        title: 'Pacman',
        genre: 'Arcade',
        releaseYear: 1998
      }

      const postResponse = await request(server).post('/games').send(body);
      const id = postResponse.body.id;
      const response = await request(server).get(`/games/${id}`);
      expect(response.type).toMatch(/json/i);
    });
  });

  describe('DELETE /games/id', () => {
    it('should return status code 404 if game is not found', async () => {
      let response = await request(server).delete('/games/1');
      expect(response.status).toBe(405);
    });
    it('should return status 204 if a game is deleted', async () => {
      const body = {
        title: 'Pacman',
        genre: 'Arcade',
        releaseYear: 1998
      }

      const postResponse = await request(server).post('/games').send(body);
      const id = postResponse.body.id;
      const response = await request(server).delete(`/games/${id}`);
      expect(response.status).toBe(204);
    });
    it('should delete the game if found', async () => {
      const body = {
        title: 'Pacman',
        genre: 'Arcade',
        releaseYear: 1998
      }

      const postResponse = await request(server).post('/games').send(body);
      const id = postResponse.body.id;
      const response = await request(server).delete(`/games/${id}`);
      const getResponse = await request(server).get(`/games/${id}`);

      expect(getResponse.status).toBe(405);

    });
  });
});