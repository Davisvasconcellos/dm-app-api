// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const { User, TokenBlocklist } = require('../models');

// Cache em memória para blocklist de tokens (evita query ao banco a cada request)
// TTL de 60 segundos: tempo máximo que um token invalidado pode ser considerado válido
const blocklistCache = new Map();
const BLOCKLIST_CACHE_TTL_MS = 60 * 1000; // 60 segundos

const isTokenBlocked = async (token) => {
  // Verifica cache primeiro
  const cached = blocklistCache.get(token);
  if (cached !== undefined) {
    return cached;
  }
  // Consulta banco apenas se não estiver em cache
  const blocked = await TokenBlocklist.findByPk(token);
  const result = !!blocked;
  blocklistCache.set(token, result);
  // Remove do cache após TTL
  setTimeout(() => blocklistCache.delete(token), BLOCKLIST_CACHE_TTL_MS);
  return result;
};

// Middleware para validar token e popular req.user
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    // Verificar se o token está na blocklist (com cache em memória)
    const blocked = await isTokenBlocked(token);
    if (blocked) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca usuário no banco para garantir que ainda existe e está ativo
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'role', 'email', 'plan_id']
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Popula req.user com dados frescos do banco (garante role atualizada)
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      planId: user.plan_id
    };

    next();
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erro no token:', err.message);
    }
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};

// Middleware para checar roles
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    // Admin, Master e MasterAdmin têm todos os acessos
    const highPrivilegeRoles = ['admin', 'master', 'masteradmin'];

    if (
      highPrivilegeRoles.includes(req.user.role) ||
      roles.includes(req.user.role)
    ) {
      return next();
    }

    return res.status(403).json({ 
      error: 'Forbidden',
      message: `Acesso negado. Seu perfil não possui permissão para este recurso.`
    });
  };
};

// Middleware para verificar acesso a módulos
const requireModule = (moduleSlug) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Não autenticado' });
      }

      // Master/Admin sempre acessa tudo
      const highPrivilegeRoles = ['admin', 'master', 'masteradmin'];
      if (highPrivilegeRoles.includes(req.user.role)) {
        return next();
      }

      const user = await User.findByPk(req.user.userId, {
        include: [{ 
          model: require('../models').SysModule,
          as: 'modules',
          where: { slug: moduleSlug, active: true },
          required: false 
        }]
      });

      // Se encontrou o módulo na lista do usuário
      if (user && user.modules && user.modules.length > 0) {
        return next();
      }

      return res.status(403).json({ 
        error: 'Forbidden',
        message: `Acesso negado. Módulo '${moduleSlug}' não está disponível para seu usuário.`
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao verificar permissão de módulo:', error);
      }
      return res.status(500).json({ message: 'Erro interno de verificação de permissão' });
    }
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requireModule
};
