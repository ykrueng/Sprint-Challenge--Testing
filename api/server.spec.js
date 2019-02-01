const request = require('supertest');

const server = require('./server.js');

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

      response = await request(server).post('/games').send({...body, releaseYear: 1980});
      expect(response.status).toBe(201);
    })
  });
});