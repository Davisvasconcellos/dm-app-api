const express = require('express');
const request = require('supertest');

jest.mock('../middlewares/auth', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { userId: 1, role: 'admin', email: 'admin@example.com' };
    next();
  }
}));

jest.mock('../middlewares/storeContext', () => ({
  requireStoreContext: () => (req, res, next) => {
    req.storeId = String(req.query.store_id || req.body.store_id || 'store-uuid-1');
    next();
  },
  requireStoreAccess: (req, res, next) => {
    req.storeDbId = 10;
    req.store = { id: 10, id_code: req.storeId, name: 'Loja Teste', owner_id: 1 };
    next();
  }
}));

jest.mock('../models', () => {
  const sequelize = {
    transaction: async (fn) => fn({})
  };

  const StoreInvite = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn()
  };

  const StoreMember = {
    findOne: jest.fn(),
    create: jest.fn()
  };

  const User = {
    findOne: jest.fn()
  };

  const Store = {
    findByPk: jest.fn()
  };

  return {
    sequelize,
    StoreInvite,
    StoreMember,
    User,
    Store
  };
});

const storeInvitesRoutes = require('../routes/storeInvites');
const storeInvitesPublicRoutes = require('../routes/storeInvitesPublic');
const { StoreInvite, StoreMember, Store, User } = require('../models');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/store-invites', storeInvitesRoutes);
  app.use('/api/public/v1/store-invites', storeInvitesPublicRoutes);
  return app;
}

describe('Store Invites', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates invite and returns link', async () => {
    StoreInvite.findAll.mockResolvedValue([]);
    User.findOne.mockResolvedValue(null);
    StoreInvite.create.mockResolvedValue({
      id_code: 'inv-1',
      invited_email: 'user@example.com',
      role: 'collaborator',
      permissions: [],
      status: 'pending'
    });

    const app = makeApp();
    const res = await request(app)
      .post('/api/v1/store-invites')
      .send({ store_id: 'store-uuid-1', email: 'user@example.com' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.invited_email).toBe('user@example.com');
    expect(typeof res.body.invite_link).toBe('string');
  });

  it('accepts invite and creates membership', async () => {
    const invite = {
      id_code: 'inv-1',
      invited_email: 'admin@example.com',
      status: 'pending',
      expires_at: new Date(Date.now() + 60_000),
      store_id: 10,
      role: 'manager',
      permissions: ['financial:read'],
      update: jest.fn().mockResolvedValue(true)
    };

    StoreInvite.findOne.mockResolvedValue(invite);
    Store.findByPk.mockResolvedValue({ id: 10, id_code: 'store-uuid-1', name: 'Loja Teste' });
    StoreMember.findOne.mockResolvedValue(null);
    StoreMember.create.mockResolvedValue({ id_code: 'mem-1' });

    const app = makeApp();
    const res = await request(app)
      .post('/api/v1/store-invites/accept')
      .send({ token: 'any-token' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(StoreMember.create).toHaveBeenCalled();
    expect(invite.update).toHaveBeenCalled();
  });

  it('resolves invite publicly', async () => {
    StoreInvite.findOne.mockResolvedValue({
      id_code: 'inv-1',
      invited_email: 'user@example.com',
      status: 'pending',
      expires_at: new Date(Date.now() + 60_000),
      store_id: 10
    });
    Store.findByPk.mockResolvedValue({ id_code: 'store-uuid-1', name: 'Loja Teste' });
    User.findOne.mockResolvedValue({ id: 99 });

    const app = makeApp();
    const res = await request(app)
      .post('/api/public/v1/store-invites/resolve')
      .send({ token: 'any-token' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.store.id_code).toBe('store-uuid-1');
    expect(res.body.data.invite.user_exists).toBe(true);
  });
});
