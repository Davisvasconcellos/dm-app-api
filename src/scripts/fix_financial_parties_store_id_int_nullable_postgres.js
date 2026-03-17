const { sequelize } = require('../config/database');

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

  const tableName = 'financial_parties';
  const legacyColumn = 'store_id_int';

  const hasLegacy = await columnExists(tableName, legacyColumn);
  if (!hasLegacy) {
    return;
  }

  await sequelize.query(
    `ALTER TABLE ${tableName} ALTER COLUMN ${legacyColumn} DROP NOT NULL;`
  );
}

run()
  .then(async () => {
    await sequelize.close();
  })
  .catch(async (error) => {
    console.error('Erro ao remover NOT NULL de financial_parties.store_id_int:', error);
    try {
      await sequelize.close();
    } catch (e) {
    }
    process.exitCode = 1;
  });

