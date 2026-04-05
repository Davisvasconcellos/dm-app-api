const express = require('express');
const request = require('supertest');

let mockCurrentRole = 'master';

jest.mock('../middlewares/auth', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { userId: 1, role: mockCurrentRole };
    next();
  },
  requireRole: (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  }
}));

jest.mock('../models', () => ({
  SysModule: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

const routes = require('../routes/sysModules');
const { SysModule } = require('../models');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/sys-modules', routes);
  return app;
}

describe('SysModules management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentRole = 'master';
  });

  it('GET / returns active only by default', async () => {
    SysModule.findAll.mockResolvedValue([]);
    const app = makeApp();
    const res = await request(app).get('/api/v1/sys-modules');
    expect(res.statusCode).toBe(200);
    expect(SysModule.findAll).toHaveBeenCalled();
  });

  it('POST / creates a module (master)', async () => {
    SysModule.findOne.mockResolvedValue(null);
    SysModule.create.mockResolvedValue({ id_code: 'm1', slug: 'events' });
    const app = makeApp();
    const res = await request(app).post('/api/v1/sys-modules').send({ name: 'Events', slug: 'events' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('POST / blocks non-master roles', async () => {
    mockCurrentRole = 'admin';
    const app = makeApp();
    const res = await request(app).post('/api/v1/sys-modules').send({ name: 'X', slug: 'x' });
    expect(res.statusCode).toBe(403);
  });
});
