const { sequelize } = require('../config/database');
const fs = require('fs/promises');
const path = require('path');

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

function isNumericType(columnInfo) {
  if (!columnInfo) return false;
  return (
    columnInfo.data_type === 'bigint' ||
    columnInfo.data_type === 'integer' ||
    columnInfo.udt_name === 'int8' ||
    columnInfo.udt_name === 'int4'
  );
}

async function convertStoreId(tableName, knownIndexNames = []) {
  const storeIdInfo = await getColumnInfo(tableName, 'store_id');
  if (!storeIdInfo) {
    return { tableName, changed: false, reason: 'missing_store_id_column' };
  }

  if (!isNumericType(storeIdInfo)) {
    return { tableName, changed: false, reason: 'already_string' };
  }

  await sequelize.transaction(async (t) => {
    for (const idxName of knownIndexNames) {
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
        UPDATE ${tableName} ft
        SET store_id_code = s.id_code
        FROM stores s
        WHERE ft.store_id_code IS NULL
          AND ft.store_id IS NOT NULL
          AND s.id = ft.store_id
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
      `CREATE INDEX IF NOT EXISTS ${tableName}_store_id_idx ON ${tableName} (store_id);`,
      { transaction: t }
    );

    const statusInfo = await getColumnInfo(tableName, 'status');
    if (statusInfo) {
      await sequelize.query(
        `CREATE INDEX IF NOT EXISTS ${tableName}_store_status_idx ON ${tableName} (store_id, status);`,
        { transaction: t }
      );
    }
  });

  return { tableName, changed: true, reason: 'converted' };
}

async function run() {
  await sequelize.authenticate();

  const dialect = sequelize.getDialect();
  if (dialect !== 'postgres') {
    throw new Error(`Script esperado para Postgres, mas dialect é: ${dialect}`);
  }

  const targets = [
    { table: 'financial_transactions', indexes: ['financial_transactions_store_status_idx', 'financial_transactions_store_type_idx', 'financial_transactions_store_id_idx'] },
    { table: 'financial_tags', indexes: ['financial_tags_store_id_idx'] },
    { table: 'financial_bank_accounts', indexes: ['financial_bank_accounts_store_id_idx'] },
    { table: 'financial_recurrences', indexes: ['financial_recurrences_store_status_idx', 'financial_recurrences_store_id_idx'] },
    { table: 'financial_categories', indexes: ['financial_categories_store_status_idx', 'financial_categories_store_id_idx'] },
    { table: 'financial_cost_centers', indexes: ['financial_cost_centers_store_status_idx', 'financial_cost_centers_store_id_idx'] },
    { table: 'financial_parties', indexes: ['financial_parties_store_status_idx', 'financial_parties_store_id_idx'] }
  ];

  const results = [];
  for (const t of targets) {
    results.push(await convertStoreId(t.table, t.indexes));
  }

  const changed = results.filter((r) => r.changed);
  const payload = { changed: changed.map((c) => c.tableName), results };
  const outputPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.resolve(process.cwd(), 'financial_store_id_fix.json');
  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

run()
  .then(async () => {
    await sequelize.close();
  })
  .catch(async (error) => {
    console.error('Erro ao normalizar store_id nas tabelas financial_*:', error);
    try {
      await sequelize.close();
    } catch (e) {
    }
    process.exitCode = 1;
  });
