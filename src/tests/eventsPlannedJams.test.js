const express = require('express');
const request = require('supertest');

jest.mock('firebase-admin', () => ({
  apps: [],
  credential: { cert: jest.fn(), applicationDefault: jest.fn() },
  initializeApp: jest.fn(),
  firestore: jest.fn(() => ({}))
}));

jest.mock('../middlewares/auth', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { userId: 1, role: 'customer' };
    next();
  }
}));

jest.mock('../models', () => ({
  Event: { findOne: jest.fn() },
  EventQuestion: {},
  EventResponse: {},
  EventAnswer: {},
  User: {},
  EventGuest: { findOne: jest.fn() },
  TokenBlocklist: { findByPk: jest.fn() },
  EventTicketType: {},
  EventTicket: {},
  EventJam: { findAll: jest.fn(), findOne: jest.fn() },
  EventJamSong: { findAll: jest.fn(), findOne: jest.fn() },
  EventJamSongLike: { findAll: jest.fn(), findOne: jest.fn(), create: jest.fn(), count: jest.fn() }
}));

const routes = require('../routes/eventsOpen');
const { Event, EventJam, EventJamSong, EventJamSongLike, EventGuest } = require('../models');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/public/v1/events', routes);
  return app;
}

describe('Public planned jams', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists planned songs publicly', async () => {
    Event.findOne.mockResolvedValue({ id: 1 });
    EventJam.findAll.mockResolvedValue([
      { id: 10, id_code: 'jam-1', name: 'Jam', slug: 'jam', status: 'active', toJSON() { return this; } }
    ]);
    EventJamSong.findAll.mockResolvedValue([
      {
        id: 100,
        id_code: 'song-1',
        jam_id: 10,
        title: 'Song',
        artist: 'Artist',
        cover_image: null,
        order_index: 0,
        ready: true,
        catalog_id: null,
        toJSON() { return this; }
      }
    ]);
    EventJamSongLike.findAll.mockResolvedValue([{ jam_song_id: 100, count: '2' }]);

    const app = makeApp();
    const res = await request(app).get('/api/public/v1/events/evt-1/jams/planned');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.jams[0].songs[0].like_count).toBe(2);
  });

  it('toggles like for planned song', async () => {
    Event.findOne.mockResolvedValue({ id: 1 });
    EventJam.findOne.mockResolvedValue({ id: 10 });
    EventJamSong.findOne.mockResolvedValue({ id: 100 });
    EventGuest.findOne.mockResolvedValue({ id: 50 });
    EventJamSongLike.findOne.mockResolvedValue(null);
    EventJamSongLike.create.mockResolvedValue({ id: 1 });
    EventJamSongLike.count.mockResolvedValue(1);

    const app = makeApp();
    const res = await request(app).post('/api/public/v1/events/evt-1/jams/jam-1/songs/song-1/like');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.like_count).toBe(1);
  });
});
