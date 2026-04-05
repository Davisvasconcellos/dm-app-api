const express = require('express');
const request = require('supertest');

jest.mock('../middlewares/auth', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { userId: 1, role: 'admin' };
    next();
  },
  requireModule: () => (req, res, next) => next()
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

jest.mock('../middlewares/storePermissions', () => ({
  requireStorePermission: () => (req, res, next) => next()
}));

jest.mock('../models', () => ({
  sequelize: { transaction: jest.fn(async (fn) => fn({})) },
  User: { findOne: jest.fn(), findByPk: jest.fn() },
  StoreMember: { findOne: jest.fn() },
  StoreUser: { findOne: jest.fn() },
  Party: {},
  ProjectProject: { findOne: jest.fn() },
  ProjectMember: { findOne: jest.fn(), create: jest.fn() },
  ProjectStage: { findAll: jest.fn() },
  ProjectTask: {},
  ProjectSession: {},
  ProjectTimeEntry: {},
  ProjectMemberCost: {},
  ProjectNotification: {}
}));

const routes = require('../routes/project');
const { User, StoreMember, ProjectProject, ProjectMember } = require('../models');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/project', routes);
  return app;
}

describe('Project add member resolves StoreMember id_code', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates membership when body.user_id is store_members.id_code', async () => {
    ProjectProject.findOne.mockResolvedValue({ id: 1, id_code: 'proj-1', store_id: 'store-uuid-1' });
    User.findOne.mockResolvedValue(null);
    StoreMember.findOne.mockResolvedValue({ id_code: 'sm-1', store_id: 10, status: 'active', user_id: 2 });
    User.findByPk.mockResolvedValue({ id: 2, id_code: 'u-2', update: jest.fn(), toJSON() { return this; } });
    ProjectMember.findOne.mockResolvedValue(null);
    ProjectMember.create.mockResolvedValue({ id_code: 'pm-1', toJSON() { return this; } });

    const app = makeApp();
    const res = await request(app)
      .post('/api/v1/project/projects/proj-1/members')
      .query({ store_id: 'store-uuid-1' })
      .send({ user_id: 'sm-1', role: 'member' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
