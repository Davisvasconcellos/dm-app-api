const express = require('express');
const request = require('supertest');

jest.mock('../middlewares/auth', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { userId: 1, role: 'customer' };
    next();
  },
  requireRole: () => (req, res, next) => next(),
  requireModule: () => (req, res, next) => next()
}));

jest.mock('../models', () => ({
  Event: { findOne: jest.fn() },
  EventJam: { findAll: jest.fn(), findOne: jest.fn() },
  EventJamSong: { findOne: jest.fn(), findAll: jest.fn(), count: jest.fn() },
  EventJamSongInstrumentSlot: {},
  EventJamSongCandidate: {},
  EventJamSongRating: {},
  EventGuest: { findOne: jest.fn() },
  User: {},
  EventJamMusicCatalog: { findOne: jest.fn() },
  TokenBlocklist: {}
}));

const routes = require('../routes/eventJams');
const { Event, EventJam, EventJamSong, EventGuest, EventJamMusicCatalog } = require('../models');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/events', routes);
  return app;
}

describe('Jams catalog access', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows checked-in guest to read catalog lyrics', async () => {
    Event.findOne.mockResolvedValue({ id: 10, id_code: 'evt-1', created_by: 99 });
    EventGuest.findOne.mockResolvedValue({ id: 1, check_in_at: new Date() });
    EventJam.findAll.mockResolvedValue([{ id: 20 }]);
    EventJamMusicCatalog.findOne.mockResolvedValue({
      id: 30,
      id_code: 'cat-1',
      title: 'Song',
      artist: 'Artist',
      lyrics: 'La la',
      chords: null,
      toJSON() { return this; }
    });
    EventJamSong.findOne.mockResolvedValue({ id: 40 });

    const app = makeApp();
    const res = await request(app).get('/api/v1/events/evt-1/jams/catalog/cat-1');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.catalog.id_code).toBe('cat-1');
  });

  it('blocks non checked-in guest', async () => {
    Event.findOne.mockResolvedValue({ id: 10, id_code: 'evt-1', created_by: 99 });
    EventGuest.findOne.mockResolvedValue(null);
    EventJamMusicCatalog.findOne.mockResolvedValue({
      id: 30,
      id_code: 'cat-1',
      toJSON() { return this; }
    });

    const app = makeApp();
    const res = await request(app).get('/api/v1/events/evt-1/jams/catalog/cat-1');
    expect(res.statusCode).toBe(403);
  });
});

