const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

async function getColumns(tableName) {
  const [rows] = await sequelize.query(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = :tableName
    `,
    { replacements: { tableName } }
  );
  return new Set(rows.map((r) => r.column_name));
}

async function getPrimaryKeyColumn(tableName) {
  const [rows] = await sequelize.query(
    `
      SELECT kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
       AND tc.table_schema = kcu.table_schema
      WHERE tc.table_schema = 'public'
        AND tc.table_name = :tableName
        AND tc.constraint_type = 'PRIMARY KEY'
      ORDER BY kcu.ordinal_position ASC
      LIMIT 1
    `,
    { replacements: { tableName } }
  );
  return rows[0]?.column_name || null;
}

async function ensureColumn(tableName, columnName, sqlType, options = {}) {
  const { defaultValueSql } = options;
  const cols = await getColumns(tableName);
  if (cols.has(columnName)) return;

  const defaultSql = defaultValueSql ? `DEFAULT ${defaultValueSql}` : '';
  await sequelize.query(
    `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS ${columnName} ${sqlType} ${defaultSql};`
  );
}

async function ensureUniqueIndex(tableName, indexName, columns) {
  await sequelize.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS ${indexName} ON ${tableName} (${columns.join(', ')});`
  );
}

async function ensureIndex(tableName, indexName, columns) {
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS ${indexName} ON ${tableName} (${columns.join(', ')});`
  );
}

async function populateIdCode(tableName, pkColumn) {
  if (!pkColumn) {
    return;
  }

  const [rows] = await sequelize.query(
    `
      SELECT ${pkColumn} AS pk
      FROM ${tableName}
      WHERE id_code IS NULL OR id_code = ''
    `
  );

  for (const row of rows) {
    const idCode = `txn-${uuidv4()}`;
    await sequelize.query(
      `UPDATE ${tableName} SET id_code = :idCode WHERE ${pkColumn} = :pk;`,
      { replacements: { idCode, pk: row.pk } }
    );
  }
}

async function run() {
  await sequelize.authenticate();

  const dialect = sequelize.getDialect();
  if (dialect !== 'postgres') {
    throw new Error(`Script esperado para Postgres, mas dialect é: ${dialect}`);
  }

  const tableName = 'financial_transactions';

  await ensureColumn(tableName, 'id_code', 'VARCHAR(255)');
  await ensureColumn(tableName, 'currency', 'VARCHAR(3)', { defaultValueSql: `'BRL'` });
  await ensureColumn(tableName, 'is_deleted', 'BOOLEAN', { defaultValueSql: 'FALSE' });
  await ensureColumn(tableName, 'is_paid', 'BOOLEAN', { defaultValueSql: 'FALSE' });
  await ensureColumn(tableName, 'nf', 'VARCHAR(64)');
  await ensureColumn(tableName, 'paid_at', 'DATE');
  await ensureColumn(tableName, 'bank_account_id', 'VARCHAR(64)');
  await ensureColumn(tableName, 'category', 'VARCHAR(64)');
  await ensureColumn(tableName, 'cost_center', 'VARCHAR(64)');
  await ensureColumn(tableName, 'created_by_user_id', 'INTEGER');
  await ensureColumn(tableName, 'updated_by_user_id', 'INTEGER');

  const cols = await getColumns(tableName);
  if (cols.has('created_at')) {
    await sequelize.query(`UPDATE ${tableName} SET created_at = NOW() WHERE created_at IS NULL;`);
  }
  if (cols.has('updated_at')) {
    await sequelize.query(`UPDATE ${tableName} SET updated_at = NOW() WHERE updated_at IS NULL;`);
  }

  if (cols.has('currency')) {
    await sequelize.query(`UPDATE ${tableName} SET currency = 'BRL' WHERE currency IS NULL;`);
  }
  if (cols.has('is_deleted')) {
    await sequelize.query(`UPDATE ${tableName} SET is_deleted = FALSE WHERE is_deleted IS NULL;`);
  }
  if (cols.has('is_paid')) {
    await sequelize.query(`UPDATE ${tableName} SET is_paid = FALSE WHERE is_paid IS NULL;`);
  }

  const pkColumn = await getPrimaryKeyColumn(tableName);
  await populateIdCode(tableName, pkColumn);

  await ensureUniqueIndex(tableName, 'financial_transactions_id_code_uq', ['id_code']);

  if (cols.has('store_id')) {
    await ensureIndex(tableName, 'financial_transactions_store_id_idx', ['store_id']);
  }
  if (cols.has('store_id') && cols.has('type')) {
    await ensureIndex(tableName, 'financial_transactions_store_type_idx', ['store_id', 'type']);
  }
  if (cols.has('store_id') && cols.has('status')) {
    await ensureIndex(tableName, 'financial_transactions_store_status_idx', ['store_id', 'status']);
  }
}

run()
  .then(async () => {
    await sequelize.close();
  })
  .catch(async (error) => {
    console.error('Erro ao ajustar schema de financial_transactions:', error);
    try {
      await sequelize.close();
    } catch (e) {
    }
    process.exitCode = 1;
  });

