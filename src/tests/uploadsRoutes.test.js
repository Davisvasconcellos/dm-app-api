const request = require('supertest');

jest.mock('../middlewares/auth', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { userId: 1, role: 'admin', email: 'admin@example.com' };
    next();
  },
  requireRole: () => (req, res, next) => next(),
  requireModule: () => (req, res, next) => next()
}));

jest.mock('../models', () => {
  const Sequelize = require('sequelize');
  return {
    sequelize: {
      define: jest.fn(),
      authenticate: jest.fn(),
      close: jest.fn(),
      transaction: jest.fn()
    },
    Op: Sequelize.Op
  };
});

const app = require('../server');

describe('Uploads route aliases', () => {
  it('mounts /api/v1/uploads (returns 400 without file)', async () => {
    const res = await request(app).post('/api/v1/uploads').send({});
    expect([400, 415]).toContain(res.statusCode);
  });
});

