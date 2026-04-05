const express = require('express');
const request = require('supertest');

jest.mock('../middlewares/auth', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { userId: 1, role: 'customer' };
    next();
  },
  requireModule: () => (req, res, next) => next()
}));

jest.mock('../middlewares/storeContext', () => ({
  requireStoreContext: () => (req, res, next) => next(),
  requireStoreAccess: (req, res, next) => next()
}));

jest.mock('../middlewares/storePermissions', () => ({
  requireStorePermission: () => (req, res, next) => next()
}));

jest.mock('../models', () => ({
  sequelize: { transaction: jest.fn(async (fn) => fn({})) },
  User: { findOne: jest.fn(), findByPk: jest.fn() },
  Store: { findAll: jest.fn() },
  StoreMember: { findAll: jest.fn(), findOne: jest.fn() },
  StoreUser: { findAll: jest.fn(), findOne: jest.fn() },
  Party: { findOne: jest.fn() },
  ProjectProject: { findAndCountAll: jest.fn(), findOne: jest.fn() },
  ProjectMember: { findAll: jest.fn(), findOne: jest.fn(), create: jest.fn() },
  ProjectStage: { findAll: jest.fn() },
  ProjectTask: { findAll: jest.fn() },
  ProjectSession: { findAll: jest.fn(), findOne: jest.fn(), create: jest.fn() },
  ProjectTimeEntry: { findAll: jest.fn(), findOne: jest.fn(), create: jest.fn(), update: jest.fn() },
  ProjectMemberCost: { findAll: jest.fn(), findOne: jest.fn(), create: jest.fn() },
  ProjectNotification: { findAll: jest.fn(), findOne: jest.fn() }
}));

const routes = require('../routes/project');
const { ProjectMember, StoreMember, StoreUser, Store } = require('../models');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/project', routes);
  return app;
}

describe('Project me scope', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns grouped stores and projects', async () => {
    ProjectMember.findAll.mockResolvedValue([
      {
        toJSON() {
          return {
            role: 'member',
            status: 'active',
            project: {
              id: 10,
              id_code: 'proj-1',
              store_id: 'store-1',
              title: 'P1',
              logo_url: null,
              status: 'active',
              client_name: 'C1',
              client_party_id: null,
              start_date: null,
              end_date: null
            }
          };
        }
      }
    ]);

    StoreMember.findAll.mockResolvedValue([
      {
        toJSON() {
          return {
            role: 'collaborator',
            permissions: ['project:read'],
            store: { id: 1, id_code: 'store-1', name: 'RJ', slug: null, logo_url: null, banner_url: null }
          };
        }
      }
    ]);

    StoreUser.findAll.mockResolvedValue([]);
    Store.findAll.mockResolvedValue([]);

    const app = makeApp();
    const res = await request(app).get('/api/v1/project/me/scope');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].store.id_code).toBe('store-1');
    expect(res.body.data[0].projects[0].id_code).toBe('proj-1');
  });
});

