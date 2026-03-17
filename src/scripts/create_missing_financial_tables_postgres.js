const { sequelize } = require('../config/database');

async function run() {
  try {
    await sequelize.authenticate();

    const dialect = sequelize.getDialect();
    if (dialect !== 'postgres') {
      throw new Error(`Script esperado para Postgres, mas dialect é: ${dialect}`);
    }

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS financial_tags (
        id SERIAL PRIMARY KEY,
        id_code VARCHAR(255) NOT NULL UNIQUE,
        store_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        color VARCHAR(20),
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await sequelize.query(`CREATE INDEX IF NOT EXISTS financial_tags_store_id_idx ON financial_tags (store_id);`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS financial_tags_status_idx ON financial_tags (status);`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS financial_tags_name_idx ON financial_tags (name);`);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS financial_transaction_tags (
        transaction_id VARCHAR(255) NOT NULL,
        tag_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (transaction_id, tag_id)
      );
    `);

    await sequelize.query(`CREATE INDEX IF NOT EXISTS financial_transaction_tags_txn_idx ON financial_transaction_tags (transaction_id);`);
    await sequelize.query(`CREATE INDEX IF NOT EXISTS financial_transaction_tags_tag_idx ON financial_transaction_tags (tag_id);`);

    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'financial_transaction_tags_transaction_id_fkey'
        ) THEN
          ALTER TABLE financial_transaction_tags
          ADD CONSTRAINT financial_transaction_tags_transaction_id_fkey
          FOREIGN KEY (transaction_id)
          REFERENCES financial_transactions (id_code)
          ON UPDATE CASCADE
          ON DELETE CASCADE;
        END IF;
      END $$;
    `);

    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'financial_transaction_tags_tag_id_fkey'
        ) THEN
          ALTER TABLE financial_transaction_tags
          ADD CONSTRAINT financial_transaction_tags_tag_id_fkey
          FOREIGN KEY (tag_id)
          REFERENCES financial_tags (id_code)
          ON UPDATE CASCADE
          ON DELETE CASCADE;
        END IF;
      END $$;
    `);

    await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('financial_tags', 'financial_transaction_tags')
      ORDER BY table_name ASC;
    `);
  } finally {
    await sequelize.close();
  }
}

run().catch((error) => {
  console.error('Erro ao criar tabelas financeiras faltantes:', error);
  process.exitCode = 1;
});

