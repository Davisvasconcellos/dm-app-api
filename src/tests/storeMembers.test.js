const express = require('express');
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
  const Store = { findOne: jest.fn() };
  const StoreMember = { findOne: jest.fn() };

  return {
    sequelize: { transaction: jest.fn() },
    Store,
    StoreMember,
    User: {},
    Product: { count: jest.fn() },
    StoreUser: {},
    StoreSchedule: {}
  };
});

const storesRoutes = require('../routes/stores');
const { Store, StoreMember } = require('../models');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/stores', storesRoutes);
  return app;
}

describe('Store members', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deactivates member by id_code', async () => {
    Store.findOne.mockResolvedValue({ id: 10, id_code: 'store-uuid-1', owner_id: 1 });

    const memberToRemove = { user_id: 19, update: jest.fn().mockResolvedValue(true) };
    StoreMember.findOne.mockResolvedValue(memberToRemove);

    const app = makeApp();
    const res = await request(app).delete('/api/v1/stores/store-uuid-1/members/mem-uuid-1');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(memberToRemove.update).toHaveBeenCalledWith({ status: 'inactive' });
  });
});

