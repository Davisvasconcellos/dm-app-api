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
  requireStoreAccess: (req, res, next) => next()
}));

jest.mock('../models', () => ({
  Party: { findOne: jest.fn() },
  FinancialTransaction: { count: jest.fn() },
  FinancialCommission: { count: jest.fn() },
  FinRecurrence: { count: jest.fn() },
  sequelize: {}
}));

const partyRoutes = require('../routes/parties');
const { Party, FinancialTransaction, FinancialCommission, FinRecurrence } = require('../models');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/financial/parties', partyRoutes);
  return app;
}

describe('Parties delete rules', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inactivates party when it has linked transactions', async () => {
    const partyInstance = { update: jest.fn().mockResolvedValue(true), destroy: jest.fn() };
    Party.findOne.mockResolvedValue(partyInstance);
    FinancialTransaction.count.mockResolvedValue(2);
    FinancialCommission.count.mockResolvedValue(0);
    FinRecurrence.count.mockResolvedValue(0);

    const app = makeApp();
    const res = await request(app)
      .delete('/api/v1/financial/parties/pty-1')
      .query({ store_id: 'store-uuid-1' });

    expect(res.statusCode).toBe(200);
    expect(partyInstance.update).toHaveBeenCalledWith({ status: 'inactive' });
    expect(partyInstance.destroy).not.toHaveBeenCalled();
    expect(res.body.links.transactions).toBe(2);
  });

  it('inactivates party when it has linked commissions', async () => {
    const partyInstance = { update: jest.fn().mockResolvedValue(true), destroy: jest.fn() };
    Party.findOne.mockResolvedValue(partyInstance);
    FinancialTransaction.count.mockResolvedValue(0);
    FinancialCommission.count.mockResolvedValue(1);
    FinRecurrence.count.mockResolvedValue(0);

    const app = makeApp();
    const res = await request(app)
      .delete('/api/v1/financial/parties/pty-1')
      .query({ store_id: 'store-uuid-1' });

    expect(res.statusCode).toBe(200);
    expect(partyInstance.update).toHaveBeenCalledWith({ status: 'inactive' });
    expect(res.body.links.commissions).toBe(1);
  });

  it('inactivates party when it has linked recurrences', async () => {
    const partyInstance = { update: jest.fn().mockResolvedValue(true), destroy: jest.fn() };
    Party.findOne.mockResolvedValue(partyInstance);
    FinancialTransaction.count.mockResolvedValue(0);
    FinancialCommission.count.mockResolvedValue(0);
    FinRecurrence.count.mockResolvedValue(3);

    const app = makeApp();
    const res = await request(app)
      .delete('/api/v1/financial/parties/pty-1')
      .query({ store_id: 'store-uuid-1' });

    expect(res.statusCode).toBe(200);
    expect(partyInstance.update).toHaveBeenCalledWith({ status: 'inactive' });
    expect(res.body.links.recurrences).toBe(3);
  });

  it('deletes party when it has no links', async () => {
    const partyInstance = { update: jest.fn(), destroy: jest.fn().mockResolvedValue(true) };
    Party.findOne.mockResolvedValue(partyInstance);
    FinancialTransaction.count.mockResolvedValue(0);
    FinancialCommission.count.mockResolvedValue(0);
    FinRecurrence.count.mockResolvedValue(0);

    const app = makeApp();
    const res = await request(app)
      .delete('/api/v1/financial/parties/pty-1')
      .query({ store_id: 'store-uuid-1' });

    expect(res.statusCode).toBe(200);
    expect(partyInstance.destroy).toHaveBeenCalled();
    expect(res.body.message).toBe('Parceiro removido com sucesso');
  });
});

