const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireModule } = require('../middlewares/auth');
const { requireStoreContext, requireStoreAccess } = require('../middlewares/storeContext');
const { FinCostCenter } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     FinCostCenter:
 *       type: object
 *       properties:
 *         id_code:
 *           type: string
 *         store_id:
 *           type: string
 *         name:
 *           type: string
 *         code:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *
 * /api/v1/financial/cost-centers:
 *   get:
 *     summary: Listar centros de custo
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
 *         description: Lista de centros de custo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FinCostCenter'
 *
 *   post:
 *     summary: Criar centro de custo
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
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Centro de custo criado
 *
 * /api/v1/financial/cost-centers/{id_code}:
 *   put:
 *     summary: Atualizar centro de custo
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
 *         description: Centro de custo atualizado
 *
 *   delete:
 *     summary: Remover centro de custo (soft delete)
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
 *         description: Centro de custo removido
 */

// GET /api/v1/financial/cost-centers
router.get('/', authenticateToken, requireModule('financial'), requireStoreContext({ allowMissingForRoles: [] }), requireStoreAccess, async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    
    where.store_id = req.storeId;
    if (status) where.status = status;
    else where.status = 'active';

    const costCenters = await FinCostCenter.findAll({
      where,
      order: [['name', 'ASC']],
      attributes: { exclude: ['id'] }
    });

    const response = costCenters.map(cc => {
      const json = cc.toJSON();
      json.id = json.id_code;
      return json;
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching cost centers:', error);
    res.status(500).json({ error: 'Erro ao buscar centros de custo' });
  }
});

// POST /api/v1/financial/cost-centers
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
    const { name, code, description } = req.body;

    const costCenter = await FinCostCenter.create({
      name,
      store_id: req.storeId,
      code,
      description
    });

    await costCenter.reload();
    const response = costCenter.toJSON();
    response.id = response.id_code;
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating cost center:', error);
    res.status(500).json({ error: 'Erro ao criar centro de custo' });
  }
});

// PUT /api/v1/financial/cost-centers/:id_code
router.put('/:id_code', authenticateToken, requireModule('financial'), requireStoreContext({ allowMissingForRoles: [] }), requireStoreAccess, async (req, res) => {
  try {
    const { id_code } = req.params;
    const costCenter = await FinCostCenter.findOne({ where: { id_code, store_id: req.storeId } });

    if (!costCenter) {
      return res.status(404).json({ error: 'Centro de custo não encontrado' });
    }

    const { name, code, description, status } = req.body;

    await costCenter.update({
      name,
      code,
      description,
      status
    });

    const response = costCenter.toJSON();
    response.id = response.id_code;
    res.json(response);
  } catch (error) {
    console.error('Error updating cost center:', error);
    res.status(500).json({ error: 'Erro ao atualizar centro de custo' });
  }
});

// DELETE /api/v1/financial/cost-centers/:id_code
router.delete('/:id_code', authenticateToken, requireModule('financial'), requireStoreContext({ allowMissingForRoles: [] }), requireStoreAccess, async (req, res) => {
  try {
    const { id_code } = req.params;
    const costCenter = await FinCostCenter.findOne({ where: { id_code, store_id: req.storeId } });

    if (!costCenter) {
      return res.status(404).json({ error: 'Centro de custo não encontrado' });
    }

    await costCenter.update({ status: 'inactive' });

    res.json({ message: 'Centro de custo removido com sucesso' });
  } catch (error) {
    console.error('Error deleting cost center:', error);
    res.status(500).json({ error: 'Erro ao remover centro de custo' });
  }
});

module.exports = router;
