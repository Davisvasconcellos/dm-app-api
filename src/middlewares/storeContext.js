const { Store, StoreMember, StoreUser } = require('../models');

function resolveStoreId(req) {
  const headerStoreId = req.headers['x-store-id'] || req.headers['x-context-store-id'];
  return headerStoreId || req.query.store_id || req.body.store_id || null;
}

const requireStoreContext = (options = {}) => {
  const { allowMissingForRoles = ['admin', 'master', 'masteradmin'] } = options;

  return (req, res, next) => {
    const storeId = resolveStoreId(req);

    if (!storeId) {
      if (req.user && allowMissingForRoles.includes(req.user.role)) {
        return next();
      }
      return res.status(400).json({
        error: 'Validation error',
        message: 'store_id é obrigatório'
      });
    }

    req.storeId = String(storeId);
    return next();
  };
};

const requireStoreAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    if (!req.storeId) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'store_id é obrigatório'
      });
    }

    const highPrivilegeRoles = ['admin', 'master', 'masteradmin'];
    if (highPrivilegeRoles.includes(req.user.role)) {
      return next();
    }

    const store = await Store.findOne({ where: { id_code: req.storeId } });
    if (!store) {
      return res.status(404).json({ error: 'Not Found', message: 'Loja não encontrada' });
    }

    req.store = store;
    req.storeDbId = store.id;

    if (store.owner_id && String(store.owner_id) === String(req.user.userId)) {
      return next();
    }

    const member = await StoreMember.findOne({
      where: { store_id: store.id, user_id: req.user.userId, status: 'active' }
    });
    if (member) {
      return next();
    }

    const legacy = await StoreUser.findOne({
      where: { store_id: store.id, user_id: req.user.userId }
    });
    if (legacy) {
      return next();
    }

    return res.status(403).json({ error: 'Forbidden', message: 'Sem permissão para acessar esta loja' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  resolveStoreId,
  requireStoreContext,
  requireStoreAccess
};

