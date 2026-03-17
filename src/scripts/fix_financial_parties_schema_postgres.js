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
    const idCode = `pty-${uuidv4()}`;
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

  const tableName = 'financial_parties';

  await ensureColumn(tableName, 'id_code', 'VARCHAR(255)');
  await ensureColumn(tableName, 'trade_name', 'VARCHAR(255)');
  await ensureColumn(tableName, 'mobile', 'VARCHAR(20)');
  await ensureColumn(tableName, 'zip_code', 'VARCHAR(10)');
  await ensureColumn(tableName, 'address_street', 'VARCHAR(255)');
  await ensureColumn(tableName, 'address_number', 'VARCHAR(20)');
  await ensureColumn(tableName, 'address_complement', 'VARCHAR(255)');
  await ensureColumn(tableName, 'address_neighborhood', 'VARCHAR(255)');
  await ensureColumn(tableName, 'address_city', 'VARCHAR(255)');
  await ensureColumn(tableName, 'address_state', 'VARCHAR(2)');

  await ensureColumn(tableName, 'is_customer', 'BOOLEAN', { defaultValueSql: 'FALSE' });
  await ensureColumn(tableName, 'is_supplier', 'BOOLEAN', { defaultValueSql: 'FALSE' });
  await ensureColumn(tableName, 'is_employee', 'BOOLEAN', { defaultValueSql: 'FALSE' });
  await ensureColumn(tableName, 'is_salesperson', 'BOOLEAN', { defaultValueSql: 'FALSE' });

  await ensureColumn(tableName, 'status', 'VARCHAR(20)', { defaultValueSql: `'active'` });
  await ensureColumn(tableName, 'created_by', 'INTEGER');

  const cols = await getColumns(tableName);
  if (cols.has('status')) {
    await sequelize.query(`UPDATE ${tableName} SET status = 'active' WHERE status IS NULL;`);
  }
  if (cols.has('is_customer')) {
    await sequelize.query(`UPDATE ${tableName} SET is_customer = FALSE WHERE is_customer IS NULL;`);
  }
  if (cols.has('is_supplier')) {
    await sequelize.query(`UPDATE ${tableName} SET is_supplier = FALSE WHERE is_supplier IS NULL;`);
  }
  if (cols.has('is_employee')) {
    await sequelize.query(`UPDATE ${tableName} SET is_employee = FALSE WHERE is_employee IS NULL;`);
  }
  if (cols.has('is_salesperson')) {
    await sequelize.query(`UPDATE ${tableName} SET is_salesperson = FALSE WHERE is_salesperson IS NULL;`);
  }

  const pkColumn = await getPrimaryKeyColumn(tableName);
  await populateIdCode(tableName, pkColumn);
  await ensureUniqueIndex(tableName, 'financial_parties_id_code_uq', ['id_code']);

  if (cols.has('store_id')) {
    await ensureIndex(tableName, 'financial_parties_store_id_idx', ['store_id']);
  }
  if (cols.has('store_id') && cols.has('status')) {
    await ensureIndex(tableName, 'financial_parties_store_status_idx', ['store_id', 'status']);
  }
}

run()
  .then(async () => {
    await sequelize.close();
  })
  .catch(async (error) => {
    console.error('Erro ao ajustar schema de financial_parties:', error);
    try {
      await sequelize.close();
    } catch (e) {
    }
    process.exitCode = 1;
  });

