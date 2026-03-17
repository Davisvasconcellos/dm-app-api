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
  const { defaultValueSql, allowNull = true } = options;
  const cols = await getColumns(tableName);
  if (cols.has(columnName)) return;

  const nullSql = allowNull ? '' : 'NOT NULL';
  const defaultSql = defaultValueSql ? `DEFAULT ${defaultValueSql}` : '';
  await sequelize.query(
    `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS ${columnName} ${sqlType} ${defaultSql} ${nullSql};`
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
  if (!pkColumn) return;

  const [rows] = await sequelize.query(
    `
      SELECT ${pkColumn} AS pk
      FROM ${tableName}
      WHERE id_code IS NULL OR id_code = ''
    `
  );

  for (const row of rows) {
    const idCode = `bk-${uuidv4()}`;
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

  const tableName = 'financial_bank_accounts';

  await ensureColumn(tableName, 'id_code', 'VARCHAR(255)');
  await ensureColumn(tableName, 'bank_code', 'VARCHAR(10)');
  await ensureColumn(tableName, 'agency', 'VARCHAR(20)');
  await ensureColumn(tableName, 'account_number', 'VARCHAR(30)');
  await ensureColumn(tableName, 'account_digit', 'VARCHAR(5)');
  await ensureColumn(tableName, 'type', 'VARCHAR(32)', { defaultValueSql: `'checking'` });
  await ensureColumn(tableName, 'is_active', 'BOOLEAN', { defaultValueSql: 'TRUE' });
  await ensureColumn(tableName, 'created_by', 'INTEGER');

  const cols = await getColumns(tableName);

  if (cols.has('active') && cols.has('is_active')) {
    await sequelize.query(`UPDATE ${tableName} SET is_active = active WHERE is_active IS NULL AND active IS NOT NULL;`);
  }
  if (cols.has('is_active')) {
    await sequelize.query(`UPDATE ${tableName} SET is_active = TRUE WHERE is_active IS NULL;`);
  }
  if (cols.has('type')) {
    await sequelize.query(`UPDATE ${tableName} SET type = 'checking' WHERE type IS NULL;`);
  }

  const pkColumn = await getPrimaryKeyColumn(tableName);
  await populateIdCode(tableName, pkColumn);
  await ensureUniqueIndex(tableName, 'financial_bank_accounts_id_code_uq', ['id_code']);

  if (cols.has('store_id')) {
    await ensureIndex(tableName, 'financial_bank_accounts_store_id_idx', ['store_id']);
  }
}

run()
  .then(async () => {
    await sequelize.close();
  })
  .catch(async (error) => {
    console.error('Erro ao ajustar schema de financial_bank_accounts:', error);
    try {
      await sequelize.close();
    } catch (e) {
    }
    process.exitCode = 1;
  });

