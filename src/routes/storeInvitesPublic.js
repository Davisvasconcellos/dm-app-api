const crypto = require('crypto');
const express = require('express');
const { body, validationResult } = require('express-validator');
const { Store, StoreInvite, User } = require('../models');

const router = express.Router();

/**
 * @swagger
 * /api/public/v1/store-invites/resolve:
 *   post:
 *     summary: Resolver convite por token (pré-login)
 *     tags: [Stores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Convite e loja resolvidos
 *       404:
 *         description: Convite inválido
 */

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

router.post('/resolve', [
  body('token').isString().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation error', details: errors.array() });
  }

  try {
    const tokenHash = hashToken(String(req.body.token));
    const invite = await StoreInvite.findOne({
      where: { token_hash: tokenHash },
      attributes: ['id_code', 'invited_email', 'status', 'expires_at', 'store_id']
    });

    if (!invite) {
      return res.status(404).json({ error: 'Not Found', message: 'Convite inválido' });
    }

    const store = await Store.findByPk(invite.store_id, { attributes: ['id_code', 'name'] });
    if (!store) {
      return res.status(404).json({ error: 'Not Found', message: 'Loja não encontrada' });
    }

    const userExists = !!(await User.findOne({
      where: { email: String(invite.invited_email).toLowerCase() },
      attributes: ['id']
    }));

    return res.json({
      success: true,
      data: {
        invite: {
          id_code: invite.id_code,
          invited_email: invite.invited_email,
          status: invite.status,
          expires_at: invite.expires_at,
          user_exists: userExists
        },
        store
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
