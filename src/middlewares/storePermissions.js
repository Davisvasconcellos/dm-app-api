const { StoreMember } = require('../models');

const requireStorePermission = (permissions) => {
  const required = Array.isArray(permissions) ? permissions : [permissions];

  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Não autenticado' });
      }

      const highPrivilegeRoles = ['admin', 'master', 'masteradmin'];
      if (highPrivilegeRoles.includes(req.user.role)) {
        return next();
      }

      if (!req.storeDbId) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'store_id é obrigatório'
        });
      }

      const member = await StoreMember.findOne({
        where: { store_id: req.storeDbId, user_id: req.user.userId, status: 'active' }
      });

      if (!member) {
        return res.status(403).json({ error: 'Forbidden', message: 'Sem permissão para acessar esta loja' });
      }

      if (member.role === 'manager') {
        return next();
      }

      const memberPermissions = Array.isArray(member.permissions) ? member.permissions : [];
      const allowed = required.some((p) => memberPermissions.includes(p));

      if (!allowed) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Acesso negado. Seu perfil não possui permissão para este recurso.'
        });
      }

      return next();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};

module.exports = {
  requireStorePermission
};

