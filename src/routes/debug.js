
const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');

router.get('/db-check', async (req, res) => {
  try {
    const results = {};
    
    // 1. Check token_blocklist
    try {
        const [rows] = await sequelize.query("SELECT * FROM token_blocklist LIMIT 1");
        results.token_blocklist = { status: 'OK', rows };
    } catch (e) {
        results.token_blocklist = { status: 'ERROR', message: e.message };
        
        // Try to fix?
        if (req.query.fix === 'true') {
            try {
                await sequelize.query(`
                    CREATE TABLE IF NOT EXISTS token_blocklist (
                        id SERIAL PRIMARY KEY,
                        token VARCHAR(512) NOT NULL UNIQUE,
                        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    );
                `);
                results.token_blocklist_fix = 'Attempted creation.';
            } catch (fixErr) {
                results.token_blocklist_fix = fixErr.message;
            }
        }
    }

    // 2. Check events.deleted_at
    try {
        await sequelize.query("SELECT deleted_at FROM events LIMIT 1");
        results.events_deleted_at = { status: 'OK' };
    } catch (e) {
        results.events_deleted_at = { status: 'ERROR', message: e.message };
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
