const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireModule } = require('../middlewares/auth');
const { requireStoreContext, requireStoreAccess } = require('../middlewares/storeContext');
const { FinTag } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     FinTag:
 *       type: object
 *       properties:
 *         id_code:
 *           type: string
 *         store_id:
 *           type: string
 *         name:
 *           type: string
 *         color:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *
 * /api/v1/financial/tags:
 *   get:
 *     summary: Listar tags financeiras
 *     tags: [Financial]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Lista de tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FinTag'
 *
 *   post:
 *     summary: Criar tag financeira
 *     tags: [Financial]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tag criada
 *
 * /api/v1/financial/tags/{id_code}:
 *   put:
 *     summary: Atualizar tag financeira
 *     tags: [Financial]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_code
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Tag atualizada
 *
 *   delete:
 *     summary: Remover tag financeira (soft delete)
 *     tags: [Financial]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_code
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: store_id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Tag removida
 */

// GET /api/v1/financial/tags
router.get('/', authenticateToken, requireModule('financial'), requireStoreContext({ allowMissingForRoles: [] }), requireStoreAccess, async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    
    where.store_id = req.storeId;
    if (status) where.status = status;
    else where.status = 'active';

    const tags = await FinTag.findAll({
      where,
      order: [['name', 'ASC']],
      attributes: { exclude: ['id'] }
    });

    const response = tags.map(tag => {
      const json = tag.toJSON();
      json.id = json.id_code;
      return json;
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Erro ao buscar tags' });
  }
});

// POST /api/v1/financial/tags
router.post('/', [
  authenticateToken,
  requireModule('financial'),
  requireStoreContext({ allowMissingForRoles: [] }),
  requireStoreAccess,
  body('name').notEmpty().withMessage('Nome é obrigatório'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, color } = req.body;

    const tag = await FinTag.create({
      name,
      store_id: req.storeId,
      color
    });

    await tag.reload();
    const response = tag.toJSON();
    response.id = response.id_code;
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ error: 'Erro ao criar tag' });
  }
});

// PUT /api/v1/financial/tags/:id_code
router.put('/:id_code', authenticateToken, requireModule('financial'), requireStoreContext({ allowMissingForRoles: [] }), requireStoreAccess, async (req, res) => {
  try {
    const { id_code } = req.params;
    const tag = await FinTag.findOne({ where: { id_code, store_id: req.storeId } });

    if (!tag) {
      return res.status(404).json({ error: 'Tag não encontrada' });
    }

    const { name, color, status } = req.body;

    await tag.update({
      name,
      color,
      status
    });

    const response = tag.toJSON();
    response.id = response.id_code;
    res.json(response);
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({ error: 'Erro ao atualizar tag' });
  }
});

// DELETE /api/v1/financial/tags/:id_code
router.delete('/:id_code', authenticateToken, requireModule('financial'), requireStoreContext({ allowMissingForRoles: [] }), requireStoreAccess, async (req, res) => {
  try {
    const { id_code } = req.params;
    const tag = await FinTag.findOne({ where: { id_code, store_id: req.storeId } });

    if (!tag) {
      return res.status(404).json({ error: 'Tag não encontrada' });
    }

    await tag.update({ status: 'inactive' });

    res.json({ message: 'Tag removida com sucesso' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ error: 'Erro ao remover tag' });
  }
});

module.exports = router;
