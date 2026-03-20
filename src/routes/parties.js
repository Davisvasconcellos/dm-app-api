const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireModule } = require('../middlewares/auth');
const { requireStoreContext, requireStoreAccess } = require('../middlewares/storeContext');
const { Party, FinancialTransaction, sequelize } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Party:
 *       type: object
 *       properties:
 *         id_code:
 *           type: string
 *         store_id:
 *           type: string
 *         name:
 *           type: string
 *         trade_name:
 *           type: string
 *         document:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         mobile:
 *           type: string
 *         is_customer:
 *           type: boolean
 *         is_supplier:
 *           type: boolean
 *         is_employee:
 *           type: boolean
 *         is_salesperson:
 *           type: boolean
 *         status:
 *           type: string
 *           enum: [active, inactive, blocked]
 *
 * /api/v1/parties:
 *   get:
 *     summary: Listar parceiros (clientes/fornecedores/etc)
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [customer, supplier, employee, salesperson]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Lista paginada de parceiros
 *
 *   post:
 *     summary: Criar parceiro
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
 *               trade_name:
 *                 type: string
 *               document:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               mobile:
 *                 type: string
 *               is_customer:
 *                 type: boolean
 *               is_supplier:
 *                 type: boolean
 *               is_employee:
 *                 type: boolean
 *               is_salesperson:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Parceiro criado
 *
 * /api/v1/parties/{id_code}:
 *   get:
 *     summary: Buscar parceiro por id_code
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
 *         description: Parceiro
 *       404:
 *         description: Não encontrado
 */

// GET /api/v1/financial/parties
router.get('/', authenticateToken, requireModule('financial'), requireStoreContext({ allowMissingForRoles: [] }), requireStoreAccess, async (req, res) => {
  try {
    const { 
      type, // customer, supplier, employee, salesperson
      search,
      page = 1, 
      limit = 20
    } = req.query;

    const where = {};
    
    where.store_id = req.storeId;

    if (type) {
      if (type === 'customer') where.is_customer = true;
      if (type === 'supplier') where.is_supplier = true;
      if (type === 'employee') where.is_employee = true;
      if (type === 'salesperson') where.is_salesperson = true;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { trade_name: { [Op.like]: `%${search}%` } },
        { document: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    // Default active only unless specified? 
    // Usually lists show active. Let's add status filter or default to active.
    // User might want to see all. Let's keep it simple for now.
    if (req.query.status) {
        where.status = req.query.status;
    } else {
        where.status = { [Op.ne]: 'blocked' }; // Show active and inactive by default? Or just active?
        // Let's show all except blocked/deleted if we had soft delete.
        // For now, let's show all.
        delete where.status; 
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Party.findAndCountAll({
      where,
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    console.error('Error fetching parties:', error);
    res.status(500).json({ error: 'Erro ao buscar parceiros' });
  }
});

// GET /api/v1/financial/parties/:id_code
router.get('/:id_code', authenticateToken, requireModule('financial'), requireStoreContext({ allowMissingForRoles: [] }), requireStoreAccess, async (req, res) => {
  try {
    const { id_code } = req.params;
    const party = await Party.findOne({ where: { id_code, store_id: req.storeId } });

    if (!party) {
      return res.status(404).json({ error: 'Parceiro não encontrado' });
    }

    res.json(party);
  } catch (error) {
    console.error('Error fetching party:', error);
    res.status(500).json({ error: 'Erro ao buscar parceiro' });
  }
});

// POST /api/v1/financial/parties
router.post('/', [
  authenticateToken,
  requireModule('financial'),
  requireStoreContext({ allowMissingForRoles: [] }),
  requireStoreAccess,
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('type').optional().isArray().withMessage('Type deve ser um array de roles [customer, supplier, etc] ou use flags individuais')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { 
      name, trade_name, document, email, phone, mobile,
      is_customer, is_supplier, is_employee, is_salesperson,
      zip_code, address_street, address_number, address_complement,
      address_neighborhood, address_city, address_state,
      notes
    } = req.body;

    // Validate that at least one role is selected? Not strictly necessary but good practice.
    // If user sends 'type' array from frontend, we map to flags.
    let flags = { is_customer, is_supplier, is_employee, is_salesperson };
    if (req.body.type && Array.isArray(req.body.type)) {
        if (req.body.type.includes('customer')) flags.is_customer = true;
        if (req.body.type.includes('supplier')) flags.is_supplier = true;
        if (req.body.type.includes('employee')) flags.is_employee = true;
        if (req.body.type.includes('salesperson')) flags.is_salesperson = true;
    }

    const newParty = await Party.create({
      name, trade_name, document, email, phone, mobile,
      ...flags,
      zip_code, address_street, address_number, address_complement,
      address_neighborhood, address_city, address_state,
      notes, store_id: req.storeId,
      created_by: req.user.userId
    });

    res.status(201).json(newParty);
  } catch (error) {
    console.error('Error creating party:', error);
    res.status(500).json({ error: 'Erro ao criar parceiro' });
  }
});

// PUT /api/v1/financial/parties/:id_code
router.put('/:id_code', authenticateToken, requireModule('financial'), requireStoreContext({ allowMissingForRoles: [] }), requireStoreAccess, async (req, res) => {
  try {
    const { id_code } = req.params;
    const party = await Party.findOne({ where: { id_code, store_id: req.storeId } });

    if (!party) {
      return res.status(404).json({ error: 'Parceiro não encontrado' });
    }

    const { 
      name, trade_name, document, email, phone, mobile,
      is_customer, is_supplier, is_employee, is_salesperson,
      zip_code, address_street, address_number, address_complement,
      address_neighborhood, address_city, address_state,
      notes, status
    } = req.body;

    // Map type array if provided
    let flags = {};
    if (is_customer !== undefined) flags.is_customer = is_customer;
    if (is_supplier !== undefined) flags.is_supplier = is_supplier;
    if (is_employee !== undefined) flags.is_employee = is_employee;
    if (is_salesperson !== undefined) flags.is_salesperson = is_salesperson;

    if (req.body.type && Array.isArray(req.body.type)) {
        flags.is_customer = req.body.type.includes('customer');
        flags.is_supplier = req.body.type.includes('supplier');
        flags.is_employee = req.body.type.includes('employee');
        flags.is_salesperson = req.body.type.includes('salesperson');
    }

    await party.update({
      name, trade_name, document, email, phone, mobile,
      ...flags,
      zip_code, address_street, address_number, address_complement,
      address_neighborhood, address_city, address_state,
      notes, status
    });

    res.json(party);
  } catch (error) {
    console.error('Error updating party:', error);
    res.status(500).json({ error: 'Erro ao atualizar parceiro' });
  }
});

// DELETE /api/v1/financial/parties/:id_code
router.delete('/:id_code', authenticateToken, requireModule('financial'), requireStoreContext({ allowMissingForRoles: [] }), requireStoreAccess, async (req, res) => {
  try {
    const { id_code } = req.params;
    const party = await Party.findOne({ where: { id_code, store_id: req.storeId } });

    if (!party) {
      return res.status(404).json({ error: 'Parceiro não encontrado' });
    }

    // Check for transactions
    const transactionCount = await FinancialTransaction.count({
        where: { party_id: id_code }
    });

    if (transactionCount > 0) {
        // Soft delete (block)
        await party.update({ status: 'inactive' }); // or blocked
        return res.json({ message: 'Parceiro inativado pois possui transações vinculadas' });
    }

    await party.destroy();
    res.json({ message: 'Parceiro removido com sucesso' });
  } catch (error) {
    console.error('Error deleting party:', error);
    res.status(500).json({ error: 'Erro ao remover parceiro' });
  }
});

module.exports = router;
