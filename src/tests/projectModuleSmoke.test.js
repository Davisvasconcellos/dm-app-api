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
  User: {},
  StoreMember: { findOne: jest.fn() },
  StoreUser: { findOne: jest.fn() },
  ProjectProject: { findAndCountAll: jest.fn() },
  ProjectMember: { findAll: jest.fn() },
  ProjectStage: { findAll: jest.fn() },
  ProjectTask: {},
  ProjectSession: {},
  ProjectTimeEntry: {},
  ProjectMemberCost: {},
  ProjectNotification: {}
}));

const routes = require('../routes/project');
const { ProjectProject, ProjectMember, ProjectStage } = require('../models');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/project', routes);
  return app;
}

describe('Project module smoke', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /projects returns success envelope', async () => {
    ProjectMember.findAll.mockResolvedValue([]);
    ProjectStage.findAll.mockResolvedValue([]);
    ProjectProject.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

    const app = makeApp();
    const res = await request(app).get('/api/v1/project/projects').query({ store_id: 'store-uuid-1' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
