const { sequelize } = require('../config/database');

async function constraintExists(tableName, constraintName) {
  const [rows] = await sequelize.query(
    `
      SELECT 1 AS ok
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      JOIN pg_namespace n ON t.relnamespace = n.oid
      WHERE n.nspname = 'public'
        AND t.relname = :tableName
        AND c.conname = :constraintName
      LIMIT 1
    `,
    { replacements: { tableName, constraintName } }
  );
  return rows.length > 0;
}

async function columnExists(tableName, columnName) {
  const [rows] = await sequelize.query(
    `
      SELECT 1 AS ok
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = :tableName
        AND column_name = :columnName
      LIMIT 1
    `,
    { replacements: { tableName, columnName } }
  );
  return rows.length > 0;
}

async function run() {
  await sequelize.authenticate();

  const dialect = sequelize.getDialect();
  if (dialect !== 'postgres') {
    throw new Error(`Script esperado para Postgres, mas dialect é: ${dialect}`);
  }

  const tableName = 'financial_cost_centers';
  const legacyColumn = 'store_id_int';
  const notNullConstraint = 'financial_cost_centers_store_id_not_null';

  const hasLegacy = await columnExists(tableName, legacyColumn);
  if (!hasLegacy) {
    return;
  }

  await sequelize.transaction(async (t) => {
    if (await constraintExists(tableName, notNullConstraint)) {
      await sequelize.query(
        `ALTER TABLE ${tableName} DROP CONSTRAINT IF EXISTS ${notNullConstraint};`,
        { transaction: t }
      );
    }

    await sequelize.query(
      `ALTER TABLE ${tableName} ALTER COLUMN ${legacyColumn} DROP NOT NULL;`,
      { transaction: t }
    );
  });
}

run()
  .then(async () => {
    await sequelize.close();
  })
  .catch(async (error) => {
    console.error('Erro ao remover NOT NULL de financial_cost_centers.store_id_int:', error);
    try {
      await sequelize.close();
    } catch (e) {
    }
    process.exitCode = 1;
  });

