const { sequelize } = require('../config/database');

async function getColumnInfo(tableName, columnName) {
  const [rows] = await sequelize.query(
    `
      SELECT
        data_type,
        udt_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = :tableName
        AND column_name = :columnName
      LIMIT 1
    `,
    { replacements: { tableName, columnName } }
  );
  return rows[0] || null;
}

async function indexExists(indexName) {
  const [rows] = await sequelize.query(
    `
      SELECT 1 AS ok
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname = :indexName
      LIMIT 1
    `,
    { replacements: { indexName } }
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

  const storeIdInfo = await getColumnInfo(tableName, 'store_id');
  if (!storeIdInfo) {
    throw new Error(`Coluna ${tableName}.store_id não encontrada`);
  }

  const isNumericStoreId =
    storeIdInfo.data_type === 'bigint' ||
    storeIdInfo.data_type === 'integer' ||
    storeIdInfo.udt_name === 'int8' ||
    storeIdInfo.udt_name === 'int4';

  if (!isNumericStoreId) {
    return;
  }

  await sequelize.transaction(async (t) => {
    const idxNames = [
      'financial_cost_centers_store_status_idx',
      'financial_cost_centers_store_id_idx'
    ];

    for (const idxName of idxNames) {
      if (await indexExists(idxName)) {
        await sequelize.query(`DROP INDEX IF EXISTS ${idxName};`, { transaction: t });
      }
    }

    await sequelize.query(
      `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS store_id_code VARCHAR(255);`,
      { transaction: t }
    );

    await sequelize.query(
      `
        UPDATE ${tableName} fcc
        SET store_id_code = s.id_code
        FROM stores s
        WHERE fcc.store_id_code IS NULL
          AND fcc.store_id IS NOT NULL
          AND s.id = fcc.store_id
      `,
      { transaction: t }
    );

    await sequelize.query(
      `
        UPDATE ${tableName}
        SET store_id_code = CAST(store_id AS TEXT)
        WHERE store_id_code IS NULL
          AND store_id IS NOT NULL
      `,
      { transaction: t }
    );

    await sequelize.query(
      `ALTER TABLE ${tableName} RENAME COLUMN store_id TO store_id_int;`,
      { transaction: t }
    );

    await sequelize.query(
      `ALTER TABLE ${tableName} RENAME COLUMN store_id_code TO store_id;`,
      { transaction: t }
    );

    await sequelize.query(
      `CREATE INDEX IF NOT EXISTS financial_cost_centers_store_id_idx ON ${tableName} (store_id);`,
      { transaction: t }
    );
    await sequelize.query(
      `CREATE INDEX IF NOT EXISTS financial_cost_centers_store_status_idx ON ${tableName} (store_id, status);`,
      { transaction: t }
    );
  });
}

run()
  .then(async () => {
    await sequelize.close();
  })
  .catch(async (error) => {
    console.error('Erro ao ajustar tipo de store_id em financial_cost_centers:', error);
    try {
      await sequelize.close();
    } catch (e) {
    }
    process.exitCode = 1;
  });

