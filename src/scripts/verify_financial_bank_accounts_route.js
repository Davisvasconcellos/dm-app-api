const express = require('express');
const request = require('supertest');

const mockAuth = {
  authenticateToken: (req, res, next) => {
    req.user = { userId: 1, role: 'admin', planId: 2 };
    next();
  },
  requireRole: () => (req, res, next) => next(),
  requireModule: () => (req, res, next) => next()
};

const mockStoreContext = {
  resolveStoreId: (req) => req.headers['x-store-id'] || req.query.store_id || null,
  requireStoreContext: () => (req, res, next) => {
    req.storeId = String(req.headers['x-store-id'] || req.query.store_id);
    next();
  },
  requireStoreAccess: (req, res, next) => next()
};

require.cache[require.resolve('../middlewares/auth')] = { exports: mockAuth };
require.cache[require.resolve('../middlewares/storeContext')] = { exports: mockStoreContext };

const bankAccountsRoutes = require('../routes/bankAccounts');

async function run() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/financial/bank-accounts', bankAccountsRoutes);

  const storeId = process.env.TEST_STORE_ID || '7e28dbfd-690e-450e-a834-ba3c8fafbf89';

  const res = await request(app)
    .get('/api/v1/financial/bank-accounts')
    .query({ store_id: storeId });

  process.stdout.write(`${res.statusCode}\n`);
  if (res.statusCode !== 200) {
    process.stdout.write(`${JSON.stringify(res.body)}\n`);
    process.exitCode = 1;
  }
}

run().catch((e) => {
  process.stderr.write(`${e.stack || e.message}\n`);
  process.exitCode = 1;
});

