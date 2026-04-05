const express = require('express');
const { SysModule } = require('../models');
const { authenticateToken, requireRole } = require('../middlewares/auth');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');

const router = express.Router();

// Listar todos os módulos (para o Admin montar os checkboxes)
router.get('/', authenticateToken, requireRole('admin', 'master', 'masteradmin'), async (req, res) => {
  try {
    const all = String(req.query.all || 'false').toLowerCase() === 'true';
    const where = {};

    if (!all) {
      where.active = true;
    } else if (!['master', 'masteradmin'].includes(req.user.role)) {
      where.active = true;
    }

    const modules = await SysModule.findAll({ where, order: [['name', 'ASC']] });

    res.json({
      success: true,
      data: modules
    });
  } catch (error) {
    console.error('List modules error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor'
    });
  }
});

router.get('/:id_code', authenticateToken, requireRole('admin', 'master', 'masteradmin'), async (req, res) => {
  try {
    const moduleRow = await SysModule.findOne({ where: { id_code: req.params.id_code } });
    if (!moduleRow) {
      return res.status(404).json({ error: 'Not Found', message: 'Módulo não encontrado' });
    }
    return res.json({ success: true, data: { module: moduleRow } });
  } catch (error) {
    console.error('Get module error:', error);
    return res.status(500).json({ error: 'Internal server error', message: 'Erro interno do servidor' });
  }
});

router.post('/', authenticateToken, requireRole('master', 'masteradmin'), [
  body('name').isLength({ min: 2, max: 255 }).trim(),
  body('slug').isLength({ min: 2, max: 100 }).trim(),
  body('description').optional({ nullable: true }).isString(),
  body('home_path').optional({ nullable: true }).isString(),
  body('active').optional({ nullable: true }).isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation error', details: errors.array() });
    }

    const normalizeSlug = (value) => String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const slug = normalizeSlug(req.body.slug);
    if (!slug) return res.status(400).json({ error: 'Validation error', message: 'slug inválido' });

    const exists = await SysModule.findOne({ where: { slug } });
    if (exists) {
      return res.status(409).json({ error: 'Duplicate entry', message: 'Slug já existe' });
    }

    const created = await SysModule.create({
      name: req.body.name,
      slug,
      description: req.body.description || null,
      home_path: req.body.home_path || null,
      active: req.body.active !== undefined ? !!req.body.active : true
    });

    return res.status(201).json({ success: true, data: { module: created } });
  } catch (error) {
    console.error('Create module error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      const path = error && error.errors && error.errors[0] && error.errors[0].path ? String(error.errors[0].path) : null;
      if (path === 'slug') {
        return res.status(409).json({ error: 'Duplicate entry', message: 'Slug já existe' });
      }
      if (path === 'id') {
        return res.status(500).json({ error: 'Internal server error', message: 'Sequência do sys_modules está inconsistente. Rode as migrations.' });
      }
      return res.status(409).json({ error: 'Duplicate entry', message: 'Registro duplicado' });
    }
    return res.status(500).json({ error: 'Internal server error', message: 'Erro interno do servidor' });
  }
});

router.patch('/:id_code', authenticateToken, requireRole('master', 'masteradmin'), [
  body('name').optional().isLength({ min: 2, max: 255 }).trim(),
  body('slug').optional().isLength({ min: 2, max: 100 }).trim(),
  body('description').optional({ nullable: true }).isString(),
  body('home_path').optional({ nullable: true }).isString(),
  body('active').optional({ nullable: true }).isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation error', details: errors.array() });
    }

    const moduleRow = await SysModule.findOne({ where: { id_code: req.params.id_code } });
    if (!moduleRow) {
      return res.status(404).json({ error: 'Not Found', message: 'Módulo não encontrado' });
    }

    const normalizeSlug = (value) => String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const patch = {};
    if (req.body.name !== undefined) patch.name = req.body.name;
    if (req.body.description !== undefined) patch.description = req.body.description;
    if (req.body.home_path !== undefined) patch.home_path = req.body.home_path;
    if (req.body.active !== undefined) patch.active = !!req.body.active;

    if (req.body.slug !== undefined) {
      const nextSlug = normalizeSlug(req.body.slug);
      if (!nextSlug) return res.status(400).json({ error: 'Validation error', message: 'slug inválido' });
      const exists = await SysModule.findOne({ where: { slug: nextSlug, id: { [Op.ne]: moduleRow.id } } });
      if (exists) return res.status(409).json({ error: 'Duplicate entry', message: 'Slug já existe' });
      patch.slug = nextSlug;
    }

    await moduleRow.update(patch);
    return res.json({ success: true, data: { module: moduleRow } });
  } catch (error) {
    console.error('Patch module error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      const path = error && error.errors && error.errors[0] && error.errors[0].path ? String(error.errors[0].path) : null;
      if (path === 'slug') {
        return res.status(409).json({ error: 'Duplicate entry', message: 'Slug já existe' });
      }
      return res.status(409).json({ error: 'Duplicate entry', message: 'Registro duplicado' });
    }
    return res.status(500).json({ error: 'Internal server error', message: 'Erro interno do servidor' });
  }
});

module.exports = router;
